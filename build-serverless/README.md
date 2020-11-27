# Build Serverless

[![npm-image]][npm-url]


> Building for serverless 

Node.js package for transpiling source code for AWS SAM(AWS Serverless) for integration with AWS Lambda & AWS API Gateway using AWS `sam-cli` from your nodejs project.

Since AWS Lambda officially only supports Node.js 12.x runtime, This package helps in converting ES6 source to es2015 node.js code to be used by `sam build` 

## Usage
This package transpiles ES6 node.js code using `@babel/cli` to native node.js code to be used with `sam build` of `aws sam-cli` tool.

The package supports both programatical and cli interface.

### CLI

To use cli interface run the below command from the root directory of the project.

```sh
$ npx @cactus-tech/build-serverless -o <dir-name> [options]
```
Run the following command to get the see other options available.

```sh
$ npx @cactus-tech/build-serverless --help
``` 
```console
build-serverless -o <dir-name> [options]

Options:
      --version              Show version number                                                                                                                               [boolean]
  -o, --output-dir           name of output dir for compiled code                                                                                                    [string] [required]
  -s, --source-dir           source code directory                                                                                                             [string] [default: "src"]
  -n, --service-name         name of the microservice                                                                                            [string] [default: "your service name"]
  -d, --service-description  description of the microservice                                                                                 [string] [default: "your description here"]
  -c, --copy-files           list of files to copy to output dir
                                              [array] [default: [".env",".eslintrc.json",".eslintignore",".babelrc",".prettierrc",".prettierignore","package.json","package-lock.json"]]
      --help                 Show help                                                                                                                                         [boolean]
```

It needs a dirname for the output code, `serverless-` is appended to the output dirname automatically.
Then it complies the code using babel and copies all the files from the `source-dir` mentioned using the `--source-dir` flag.
All files present in the `source-dir` directory will be copied to `output-dir`, if any other files are required to be copied they need to be added using the `--copy-files` flag.

#### Example
This example demonstrates compiling `.js` files from `src/`  folder and output it into `example` directory. also copying `.env`, `.babelrc`, `package.json` files are explictly copied to the `output` directory. 
```sh
 $ npx build-serverless --output-dir example --source-dir src --copy-files .env .babelrc package.json --service-name 'service name' --service-description 'service description'
```


### API

#### Installation

```sh
$ npm install @cactus-tech/build-serverless
```

To use the package programmatically, this package also exposes an api for integrating with other programs. 

```js
const buildServerless = require("@cactus-tech/build-serverless");
```
The `buildServerless` class takes the following parameters for it's constructor and exposes `init()` method.

```js
const buildServerless = new BuildServerless({
  outputDir: "example",
  sourceDir: "src",
  copyFiles: [".env",".babelrc","package.json"],
  serviceName: "service name",
  serviceDescription: "service description",
});

(async () => {
  try {
    await buildServerless.init();
  } catch (error) {}
})();
```
It also generates `template.yaml` file in the root directory and a `lambda.js` file in the `output-dir`.


[npm-image]: https://img.shields.io/npm/v/@cactus-tech/build-serverless
[npm-url]: https://www.npmjs.com/package/@cactus-tech/build-serverless
