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
    const buildServerless = new BuildServerless(argv);
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
    const buildServerless = new BuildServerless(argv);
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
    const buildServerless = new BuildServerless(argv);
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
    const buildServerless = new BuildServerless(argv);
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
    const buildServerless = new BuildServerless(argv);
    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });

  it('should fail for _generateFilesFromStub', async () => {
    expect.assertions(1);
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
        },
      },
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
    });
    const buildServerless = new BuildServerless(argv);
    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (err) {}
  });

  it('should run the program completely without errors', async () => {
    expect.assertions(3);
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
    const fs = require('fs');
    child_process.exec.mockImplementation((command, callback) => callback(null, { stdout: 'ok' }));
    const execSpy = jest.spyOn(child_process, 'exec');
    const buildServerless = new BuildServerless(argv);
    try {
      await expect(buildServerless.init()).resolves.toEqual(true);
    } catch (err) {}
    const stubTemplate =
      'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ';
    const actualTemplate = fs.readFileSync('template.yaml').toString();
    expect(stubTemplate).not.toEqual(actualTemplate);
    expect(execSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    fsRestore();
  });
});

afterAll(() => {
  fsRestore();
});
