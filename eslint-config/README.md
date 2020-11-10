# @cactus-tech/eslint-config :cactus:

> ESLint for the Cactus JavaScript style guide (ES6+ version)


## Installation

```
$ npm install --save-dev eslint @cactus-tech/eslint-config
```


## Usage

Once the `@cactus-tech/eslint-config` package is installed, you can use it by specifying `@cactus-tech` in the [`extends`](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) section of your [ESLint configuration](http://eslint.org/docs/user-guide/configuring).

```js
{
  "extends": "@cactus-tech",
  "rules": {
    // Additional, per-project rules...
  }
}
```