#! /usr/bin/env node

const cla = require('command-line-args');
const fs = require('fs');
const path = require('path');
const process = require('process');

const optionDefinitions = [
  { name: 'eslint-react', alias: 'E', type: Boolean },
  { name: 'prettier', alias: 'p', type: Boolean },
  { name: 'ts', alias: 't', type: Boolean },
  { name: 'ts-styled', alias: 'T', type: Boolean },
];

const opts = cla(optionDefinitions);
const deps = new Set();

if (opts['eslint-react']) {
  const content = `module.exports = require('@merrywhether/config/.eslintrc-ts-react.js');`;
  const file = path.resolve(process.cwd(), '.eslintrc.js');

  deps.add('eslint');
  deps.add('eslint-plugin-react');
  deps.add('@typescript-eslint/eslint-plugin');
  deps.add('@typescript-eslint/parser');
  deps.add('eslint-plugin-react-hooks');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing eslint config:\n', e);
    }
  });
}

if (opts['prettier']) {
  const content = `module.exports = require('@merrywhether/config/prettier.config.js');`;
  const file = path.resolve(process.cwd(), 'prettier.config.js');

  deps.add('prettier');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing prettier config:\n', e);
    }
  });
}

if (opts['ts']) {
  const content = `{
  "extends": "@merrywhether/config/tsconfig.json",
  "include": ["src/**/*"]
}`;
  const file = path.resolve(process.cwd(), 'tsconfig.json');

  deps.add('typescript');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing typescript config:\n', e);
    }
  });
}

if (opts['ts-styled']) {
  const content = `{
  "extends": "@merrywhether/config/tsconfig-styled.json",
  "include": ["src/**/*"]
}`;
  const file = path.resolve(process.cwd(), 'tsconfig.json');

  deps.add('typescript');
  deps.add('typescript-styled-plugin');

  fs.writeFile(file, content, (e) => {
    if (e) {
      console.error('Error writing typescript config:\n', e);
    }
  });
}

console.log(`Run this to install the corresponding dependencies:
yarn add -D ${Array.from(deps).join(' ')}`);
