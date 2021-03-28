#! /usr/bin/env node

const cla = require('command-line-args');
const fs = require('fs');
const path = require('path');
const process = require('process');

const optionDefinitions = [
  { name: 'eslint', alias: 'e', type: Boolean },
  { name: 'prettier', alias: 'p', type: Boolean },
  { name: 'typescript', alias: 't', type: Boolean },
];

const opts = cla(optionDefinitions);

if (opts['eslint']) {
  const content = `module.exports = {
  root: true,
  extends: [require.resolve('@merrywhether/config/.eslintrc.js')],
};`;
  const file = path.resolve(process.cwd(), '.eslintrc.js');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing eslint config:\n', e);
    }
  });
}

if (opts['prettier']) {
  const content = `module.exports = require('@merrywhether/config/prettier.config.js');`;
  const file = path.resolve(process.cwd(), 'prettier.config.js');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing prettier config:\n', e);
    }
  });
}

if (opts['typescript']) {
  const content = `{
  "extends": "@merrywhether/config/tsconfig.json",
  "compilerOptions": {},
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;
  const file = path.resolve(process.cwd(), 'tsconfig.json');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing typescript config:\n', e);
    }
  });
}
