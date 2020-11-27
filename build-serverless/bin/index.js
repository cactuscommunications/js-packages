#!/usr/bin/env node

const BuildServerless = require('../lib/buildServerless');

(async () => {
  try {
    await new BuildServerless().init();
  } catch (error) {
    console.error(error);
  }
})();
