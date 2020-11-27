const yargs = require('yargs');

const defaultFiles = [
  '.env',
  '.eslintrc.json',
  '.eslintignore',
  '.babelrc',
  '.prettierrc',
  '.prettierignore',
  'package.json',
  'package-lock.json',
];

/**
 * @typedef {Object} option
 * @property {"string" | "number" | "boolean" | "array" | "count"} option.type
 * @property {string} option.alias
 * @property {string | array} [option.default]
 * @property {string} option.description
 * @property {boolean} option.demandOption

 * @typedef {Object} yargsOptions
 * @property {option} yargsOptions.o
 * @property {option} yargsOptions.s
 * @property {option} yargsOptions.n
 * @property {option} yargsOptions.d
 * @property {option} yargsOptions.c
 */

/** @type {yargsOptions} */
const yargsOptions = {
  o: {
    type: 'string',
    alias: 'output-dir',
    description: 'name of output dir for compiled code',
    demandOption: true,
  },
  s: {
    type: 'string',
    alias: 'source-dir',
    default: 'src',
    description: 'source code directory',
    demandOption: false,
  },
  n: {
    type: 'string',
    alias: 'service-name',
    description: 'name of the microservice',
    demandOption: true,
  },
  d: {
    type: 'string',
    alias: 'service-description',
    description: 'description of the microservice',
    demandOption: true,
  },
  c: {
    type: 'array',
    alias: 'copy-files',
    description: 'list of files to copy to output dir',
    default: [...defaultFiles],
    demandOption: false,
  },
};

module.exports = { defaultFiles, yargsOptions };
