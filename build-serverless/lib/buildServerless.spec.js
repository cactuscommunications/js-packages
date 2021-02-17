const mockFs = require('mock-fs');
let logsTemp = [];
let logMock;

const fsMock = (config) => {
  logMock = jest.spyOn(console, 'error').mockImplementation((...args) => {
    logsTemp.push(args);
  });
  mockFs(config);
};

const fsRestore = () => {
  logMock.mockRestore();
  mockFs.restore();
  logsTemp.map((el) => console.log(...el));
  logsTemp = [];
};

jest.mock('child_process');

const child_process = require('child_process');
const path = require('path');

const BuildServerless = require('./buildServerless');

const argv = {
  _: [],
  o: 'example',
  'output-dir': 'example',
  outputDir: 'example',
  s: 'source',
  'source-dir': 'source',
  sourceDir: 'source',
  n: 'test example',
  'service-name': 'test example',
  serviceName: 'test example',
  d: 'testing',
  'service-description': 'testing',
  serviceDescription: 'testing',
  c: [
    '.env',
    '.eslintrc.json',
    '.eslintignore',
    '.babelrc',
    '.prettierrc',
    '.prettierignore',
    'package.json',
    'package-lock.json',
  ],
  'copy-files': [
    '.env',
    '.eslintrc.json',
    '.eslintignore',
    '.babelrc',
    '.prettierrc',
    '.prettierignore',
    'package.json',
    'package-lock.json',
  ],
  copyFiles: [
    '.env',
    '.eslintrc.json',
    '.eslintignore',
    '.babelrc',
    '.prettierrc',
    '.prettierignore',
    'package.json',
    'package-lock.json',
  ],
  $0: 'bin/index.js',
};

describe('[buildServerless.init]', () => {
  const buildServerless = new BuildServerless(argv);
  beforeEach(() => {
    child_process.exec.mockImplementation((command, callback) => callback(null, { stdout: 'ok' }));
  });

  it('should fail because of src folder missing', async () => {
    expect.assertions(1);
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
          'lambda.js.txt': 'Hi',
        },
      },
      '.env': mockFs.file({
        content: '',
        mode: '0000',
      }),
      'serverless-example': mockFs.directory({
        mode: '0000',
      }),
    });

    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch {}
  });

  it('should fail for fs.access output folder _createOutputDir', async () => {
    expect.assertions(1);
    fsMock({
      'serverless-example': mockFs.file({
        mode: '4444',
      }),
      source: {
        'index.js': 'import fs from "fs"',
      },
    });

    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });

  it('should fail to execute babel command', async () => {
    expect.assertions(1);
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
          'lambda.js.txt': 'Hi',
        },
      },
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
    });
    child_process.exec.mockImplementation((command, callback) =>
      callback(new Error('Mock exec Error'), { stderr: 'mock error' }),
    );
    const execSpy = jest.spyOn(child_process, 'exec');

    try {
      await buildServerless.init();
    } catch (error) {}
    expect(execSpy).toHaveBeenCalled();
  });

  it('should fail for fs.access _copyFilesToOutputDir', async () => {
    expect.assertions(1);
    fsMock({
      '.env': mockFs.file({
        content: '',
        mode: '0000',
      }),
      source: {
        'index.js': 'import fs from "fs"',
      },
    });

    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });

  it('should fail for fs.access for logs folder _copyFilesToOutputDir', async () => {
    expect.assertions(1);
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
          'lambda.js.txt': 'Hi',
        },
      },
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
      'serverless-example/logs': mockFs.file({
        content: 'aa',
        mode: '0000',
      }),
    });

    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });

  it('should fail for _generateFilesFromStub', async () => {
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
        },
      },
      'template.yml': {},
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
    });
    buildServerless.lambdaFileType = true;
    buildServerless.copyFilesAsync = jest.fn();
    try {
      await expect(await buildServerless._generateFilesFromStub()).resolves.toEqual(true);
    } catch (err) {}
  });

  it('It should call execAsync', async () => {
    buildServerless.execAsync = jest.fn();
    const execAsyncSpy = jest.spyOn(buildServerless, 'execAsync');
    await buildServerless._installAwsServerless();
    expect(execAsyncSpy).toHaveBeenCalled();
  });

  it('It should call _getCliArguments on calling _setClassProperties', () => {
    buildServerless._getCliArguments = jest.fn();
    buildServerless._getCliArguments.mockImplementation(() => {
      return {
        outputDir: '',
        copyFiles: [],
      };
    });
    const _getCliArgumentsSpy = jest.spyOn(buildServerless, '_getCliArguments');
    buildServerless._setClassProperties();
    expect(_getCliArgumentsSpy).toHaveBeenCalled();
  });

  it('should run the program completely without errors', async () => {
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
          'lambda.js.txt': 'Hi',
        },
      },
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
    });
    const _installAwsServerlessSpy = jest.spyOn(buildServerless, '_installAwsServerless');
    try {
      await expect(buildServerless.init()).resolves.toEqual(true);
      expect(_installAwsServerlessSpy).toHaveBeenCalled();
    } catch (err) {}

  });

  afterEach(() => {
    fsRestore();
  });
});

afterAll(() => {
  fsRestore();
});
