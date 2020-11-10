"use strict";

module.exports = {
  extends: ["eslint:recommended", "airbnb-base", "plugin:sonarjs/recommended", "prettier"],
  plugins: ["sonarjs", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-console": ["error", { allow: ["error", "warn"] }],
    "rest-spread-spacing": ["error", "never"],
    "template-curly-spacing": ["error", "never"],
    "max-lines-per-function": ["error", { max: 25, skipBlankLines: true, skipComments: true }],
    "sonarjs/cognitive-complexity": ["error", 5],
    complexity: ["error", 5],
    "no-underscore-dangle": ["error", { allowAfterThis: true }],
    "no-empty-function": "error",
    "no-else-return": "error",
  },
};
