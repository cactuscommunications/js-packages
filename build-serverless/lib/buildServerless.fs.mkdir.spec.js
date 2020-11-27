const mockFs = require('mock-fs');
const mockFsBinding = require('mock-fs/lib/binding');

mockFsBinding.prototype.mkdir = jest.fn((path, callback) => {
  callback(new Error('mock mkdir', {}));
});
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
describe('[buildServerless.init mkdir mock]', () => {
  beforeEach(() => {
    child_process.exec.mockImplementation((command, callback) => callback(null, { stdout: 'ok' }));
  });
  it('should fail for fs.mkdir for logs folder', async () => {
    expect.assertions(1);
    fsMock({
      lib: {
        stub: {
          'template.yaml.txt':
            'hello   {{ SERVICE_DESCRIPTION }} {{ SERVICE_NAME }} {{ OUTPUT_DIR }}        ',
          'lambda.js.txt': 'Hi',
        },
      },
      'serverless-example': {},
      '.env': '',
      source: {
        'index.js': 'import fs from "fs"',
      },
    });
    const buildServerless = new BuildServerless(argv, 'example service', 'example description');
    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });

  it('should fail for fs.mkdir for _createOutputDir', async () => {
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
    const buildServerless = new BuildServerless(argv, 'example service', 'example description');
    try {
      await expect(buildServerless.init()).rejects.toThrow();
    } catch (error) {}
  });
  afterEach(() => {
    fsRestore();
  });
});
