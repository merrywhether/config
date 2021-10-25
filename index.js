#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const cla = require('command-line-args');

const optionDefinitions = [
  { alias: 'd', defaultValue: true, name: 'default', type: Boolean },
  { alias: 'e', name: 'eslint', type: Boolean },
  { alias: 'p', name: 'prettier', type: Boolean },
  { alias: 'r', name: 'react', type: Boolean },
  { name: 'renovate', type: Boolean },
  { name: 'solid', type: Boolean },
  { name: 'styled', type: Boolean },
  { alias: 't', name: 'typescript', type: Boolean },
];

const opts = cla(optionDefinitions);

if (opts.default) {
  opts.eslint ??= true;
  opts.prettier ??= true;
  opts.typescript ??= true;
  opts.renovate ??= true;
}

if (opts.eslint) {
  const eslintConfigs = [
    `require.resolve('@merrywhether/config/eslint/base.js')`,
  ];
  if (opts.prettier) {
    eslintConfigs.push(
      `require.resolve('@merrywhether/config/eslint/prettier.js')`,
    );
  }
  if (opts.typescript) {
    eslintConfigs.push(
      `require.resolve('@merrywhether/config/eslint/typescript.js')`,
    );
  }
  if (opts.react) {
    eslintConfigs.push(
      `require.resolve('@merrywhether/config/eslint/react.js')`,
    );
  }
  if (opts.solid) {
    eslintConfigs.push(
      `require.resolve('@merrywhether/config/eslint/solid.js')`,
    );
  }

  const eslintContent = `module.exports = {
  root: true,
  extends: [
    ${eslintConfigs.join(',\n    ')},
  ],
};\n`;
  const eslintFile = path.resolve(process.cwd(), '.eslintrc.js');

  fs.writeFile(eslintFile, eslintContent, (e) => {
    if (e) {
      console.error('Error writing eslint config:\n', e);
    }
  });
}

if (opts.prettier) {
  const prettierContent = `module.exports = require('@merrywhether/config/prettier.config.js');\n`;
  const prettierFile = path.resolve(process.cwd(), 'prettier.config.js');

  fs.writeFile(prettierFile, prettierContent, (e) => {
    if (e) {
      console.error('Error writing prettier config:\n', e);
    }
  });
}

if (opts.renovate) {
  const renovateContent = `{
  "extends": ["github>merrywhether/config"]
}`;
  const renovateFile = path.resolve(process.cwd(), 'renovate.json');

  fs.writeFile(prettierFile, prettierContent, (e) => {
    if (e) {
      console.error('Error writing renovatre config:\n', e);
    }
  });
}

if (opts.typescript) {
  const typescriptConfig = opts.solid
    ? 'solid'
    : opts.styled
    ? 'styled'
    : 'base';

  const typescriptContent = `{
  "extends": "@merrywhether/config/tsconfig/${typescriptConfig}.json",
  "compilerOptions": {},
  "exclude": ["node_modules"]
}`;
  const typescriptFile = path.resolve(process.cwd(), 'tsconfig.json');

  fs.writeFile(typescriptFile, typescriptContent, (e) => {
    if (e) {
      console.error('Error writing typescript config:\n', e);
    }
  });
}
