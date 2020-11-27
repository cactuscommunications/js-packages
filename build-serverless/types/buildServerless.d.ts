#!/usr/bin/env node
export = BuildServerless;
/**
 * This class is used for building the code for AWS SAM, it converts the ES6 code to native nodejs and generates template.yaml
 *
 * @class BuildServerless
 */
declare class BuildServerless {
    /**
     *
     * @typedef {Object} arguments
     * @property {string} outputDir Directory name for output of babel transform
     * @property {string} sourceDir Directory name for source folder
     * @property {string} serviceName Name of the microservice. This will reflect in template.yaml
     * @property {string} serviceDescription Description of the microservice. This will reflect in template.yaml
     * @property {string[]} copyFiles Name of the files to be copied to output directory
     *
     */
    /**
     * Creates an instance of BuildServerless.
     * @constructor
     * @param {arguments} cliArgs
     * @memberof BuildServerless
     */
    constructor(cliArgs: {
        /**
         * Directory name for output of babel transform
         */
        outputDir: string;
        /**
         * Directory name for source folder
         */
        sourceDir: string;
        /**
         * Name of the microservice. This will reflect in template.yaml
         */
        serviceName: string;
        /**
         * Description of the microservice. This will reflect in template.yaml
         */
        serviceDescription: string;
        /**
         * Name of the files to be copied to output directory
         */
        copyFiles: string[];
    });
    /**
     * Utility function to set instance properties
     *
     * @param {arguments} args
     * @memberof BuildServerless
     */
    _setClassProperties(args: {
        /**
         * Directory name for output of babel transform
         */
        outputDir: string;
        /**
         * Directory name for source folder
         */
        sourceDir: string;
        /**
         * Name of the microservice. This will reflect in template.yaml
         */
        serviceName: string;
        /**
         * Description of the microservice. This will reflect in template.yaml
         */
        serviceDescription: string;
        /**
         * Name of the files to be copied to output directory
         */
        copyFiles: string[];
    }): void;
    outFolder: string;
    sourceFolder: string;
    serviceName: string;
    serviceDescription: string;
    usualFilesToCopy: string[];
    /**
     * Utility function to get CLI arguments
     *
     * @return {arguments} argv
     * @memberof BuildServerless
     */
    _getCliArguments(): {
        /**
         * Directory name for output of babel transform
         */
        outputDir: string;
        /**
         * Directory name for source folder
         */
        sourceDir: string;
        /**
         * Name of the microservice. This will reflect in template.yaml
         */
        serviceName: string;
        /**
         * Description of the microservice. This will reflect in template.yaml
         */
        serviceDescription: string;
        /**
         * Name of the files to be copied to output directory
         */
        copyFiles: string[];
    };
    /**
     * Utility function to prepare unique files to be copied to output dir along with the default files
     *
     * @param {string[]} userFiles files specified by the user
     * @return {string[]}
     * @memberof BuildServerless
     */
    _prepareFilesToBeCopied(userFiles: string[]): string[];
    /**
     * Function to check if current working directory has source folder.
     *
     * @memberof BuildServerless
     */
    _checkSourceDir(): Promise<void>;
    /**
     * Function to make output folder if not already present
     *
     * @memberof BuildServerless
     */
    _createOutputDir(): Promise<void>;
    /**
     * Function to execute babel transform to native node installed
     * @todo To be changed to https://github.com/babel/babel/issues/9224 in future
     * @memberof BuildServerless
     */
    _executeBabelCommand(): Promise<void>;
    /**
     * Function to handle issues while attempting to copy files from usualFilesToCopy to output dir
     *
     * @memberof BuildServerless
     */
    _copyFilesToOutputDir(): Promise<void>;
    /**
     * Utility function to copy files specified in usualFilesToCopy to output dir using copyFile method
     *
     * @param {Error[]} issues Blank array to push all errors occurred
     * @memberof BuildServerless
     */
    copyFiles(issues: Error[]): Promise<void>;
    /**
     * Utility function to create directory for keeping log files
     *
     * @memberof BuildServerless
     */
    _createLogsDir(): Promise<void>;
    /**
     * Function to read template.yaml & lambda.js stub files and generate corresponding files in output dir
     *
     * @memberof BuildServerless
     */
    _generateFilesFromStub(): Promise<void>;
    /**
     * This Function installs aws serverless express using npm
     *
     * @memberof BuildServerless
     */
    _installAwsServerless(): Promise<void>;
    /**
     * Main Function to initialize the operations to Build Serverless
     *
     * @memberof BuildServerless
     */
    init(): Promise<void>;
}
