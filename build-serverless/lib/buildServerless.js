#!/usr/bin/env node
const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const yargs = require('yargs');
const { defaultFiles, yargsOptions } = require('./config');
const toCamelCase = require('./utils');
const accessAsync = promisify(fs.access);
const mkdirAsync = promisify(fs.mkdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * This class is used for building the code for AWS SAM, it converts the ES6 code to native nodejs and generates template.yaml
 *
 * @class BuildServerless
 */
class BuildServerless {
  /**
   *
   * @typedef {Object} arguments
   * @property {string} outputDir Directory name for output of babel transform
   * @property {string} sourceDir Directory name for source folder
   * @property {string} serviceName Name of the microservice. This will reflect in template.yaml
   * @property {string} serviceDescription Description of the microservice. This will reflect in template.yaml
   * @property {string[]} copyFiles Name of the files to be copied to output directory
   * @property {string} lambdaFileType Temp and to be removed in sometime
   *
   */

  /**
   * Creates an instance of BuildServerless.
   * @constructor
   * @param {arguments} cliArgs
   * @memberof BuildServerless
   */
  constructor(cliArgs) {
    this._setClassProperties(cliArgs);
  }

  /**
   * Utility function to set instance properties
   *
   * @param {arguments} args
   * @memberof BuildServerless
   */
  _setClassProperties(args) {
    const argv = args || this._getCliArguments();
    this.outFolder = `serverless-${argv.outputDir}`;
    this.sourceFolder = argv.sourceDir;
    this.serviceName = argv.serviceName;
    this.serviceDescription = argv.serviceDescription;
    this.usualFilesToCopy = this._prepareFilesToBeCopied(argv.copyFiles);
    this.lambdaFileType = argv.lambdaFileType;
    this.copyFilesAsync = promisify(fs.copyFile);
    this.execAsync = promisify(require('child_process').exec);
  }

  /**
   * Utility function to get CLI arguments
   *
   * @return {arguments} argv
   * @memberof BuildServerless
   */
  _getCliArguments() {
    // @ts-ignore
    return yargs
      .options(yargsOptions)
      .usage('$0 -o <dir-name> -n <service name> -d <service description> [Options]')
      .wrap(yargs.terminalWidth())
      .help()
      .showHelpOnFail(true).argv;
  }

  /**
   * Utility function to prepare unique files to be copied to output dir along with the default files
   *
   * @param {string[]} userFiles files specified by the user
   * @return {string[]}
   * @memberof BuildServerless
   */
  _prepareFilesToBeCopied(userFiles) {
    return [...new Set([...userFiles, ...defaultFiles])];
  }

  /**
   * Function to check if current working directory has source folder.
   *
   * @memberof BuildServerless
   */
  async _checkSourceDir() {
    await accessAsync(join(process.cwd(), this.sourceFolder)).catch((err) => {
      throw err;
    });
  }

  /**
   * Function to make output folder if not already present
   *
   * @memberof BuildServerless
   */
  async _createOutputDir() {
    try {
      await accessAsync(join(process.cwd(), this.outFolder), fs.constants.W_OK);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      await mkdirAsync(join(process.cwd(), this.outFolder));
    }
  }

  /**
   * Function to execute babel transform to native node installed
   * @todo To be changed to https://github.com/babel/babel/issues/9224 in future
   * @memberof BuildServerless
   */
  async _executeBabelCommand() {
    const babelCommand = `npx babel ${this.sourceFolder} --out-dir ${this.outFolder} --copy-files`;
    await this.execAsync(babelCommand);
  }

  /**
   * Function to handle issues while attempting to copy files from usualFilesToCopy to output dir
   *
   * @memberof BuildServerless
   */
  async _copyFilesToOutputDir() {
    const issues = [];
    await this.copyFiles(issues);
    if (issues.length > 0) {
      throw new Error(issues.join());
    }
  }

  /**
   * Utility function to copy files specified in usualFilesToCopy to output dir using copyFile method
   *
   * @param {Error[]} issues Blank array to push all errors occurred
   * @memberof BuildServerless
   */
  async copyFiles(issues) {
    await Promise.all(
      this.usualFilesToCopy.map(async (fileName) => {
        try {
          await accessAsync(join(process.cwd(), fileName));
          await this.copyFilesAsync(fileName, join(this.outFolder, fileName));
        } catch (err) {
          if (err.code !== 'ENOENT') {
            issues.push(err);
          }
        }
      }),
    );
  }

  /**
   * Utility function to create directory for keeping log files
   *
   * @memberof BuildServerless
   */
  async _createLogsDir() {
    try {
      await accessAsync(join(this.outFolder, 'logs'), fs.constants.W_OK);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      await mkdirAsync(join(process.cwd(), this.outFolder, 'logs'));
    }
  }

  /**
   * Function to read template.yaml & lambda.js stub files and generate corresponding files in output dir
   *
   * @memberof BuildServerless
   */
  async _generateFilesFromStub() {
    await this._generateTemplateFileFromStub();
    const lambdFile = this.lambdaFileType ? 'lambda-secret-manager' : 'lambda';
    await this.copyFilesAsync(
      join(__dirname, `stub/${lambdFile}.js.txt`),
      join(this.outFolder, 'lambda.js'),
    );
  }

  /**
   * This fx is responsible for choosing templating depending on condition
   */
  async _generateTemplateFileFromStub() {
    if (fs.existsSync(join(process.cwd(), 'template.yml'))) {
      await this.copyFilesAsync(
        join(process.cwd(), 'template.yml'),
        `${this.outFolder}/template.yaml`,
      );
      console.log('Choosing user given template file!');
      return true;
    }
    const templateFile = await readFileAsync(join(__dirname, './stub/template.yaml.txt'));
    const newTemplateFile = templateFile
      .toString()
      .replace(/{{ SERVICE_NAME }}/g, `${toCamelCase(this.serviceName)}`)
      .replace(/{{ SERVICE_DESCRIPTION }}/g, `${this.serviceDescription}`)
      .replace(/{{ CODE_URI }}/g, '.');

    await writeFileAsync(`${this.outFolder}/template.yaml`, newTemplateFile);
  }

  /**
   * This Function installs aws serverless express using npm
   *
   * @memberof BuildServerless
   */
  async _installAwsServerless() {
    const npmCommand = `npm i aws-serverless-express`;
    await this.execAsync(npmCommand);
  }

  /**
   * Main Function to initialize the operations to Build Serverless
   *
   * @memberof BuildServerless
   */
  async init() {
    try {
      await this._checkSourceDir();

      await this._createOutputDir();

      await this._executeBabelCommand();

      await this._copyFilesToOutputDir();

      await this._generateFilesFromStub();

      await this._createLogsDir();

      await this._installAwsServerless();
    } catch (err) {
      console.error('MAIN::init', err);
      throw new Error(err);
    }
  }
}

module.exports = BuildServerless;
