#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const cla = require('command-line-args');

const optionDefinitions = [
  { alias: 'e', name: 'eslint', type: Boolean },
  { alias: 'p', name: 'prettier', type: Boolean },
  { alias: 't', name: 'typescript', type: Boolean },
];

const opts = cla(optionDefinitions);

// if no opts passed, we fall back to the defaults
const defaultExec = Object.keys(opts).length === 0;

if (opts['eslint'] || defaultExec) {
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

if (opts['prettier'] || defaultExec) {
  const content = `module.exports = require('@merrywhether/config/prettier.config.js');`;
  const file = path.resolve(process.cwd(), 'prettier.config.js');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing prettier config:\n', e);
    }
  });
}

if (opts['typescript'] || defaultExec) {
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
