#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const cla = require('command-line-args');

const optionDefinitions = [
  { alias: 'd', name: 'default', type: Boolean },
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
  const eslintConfig =
    opts.solid ? 'solid'
    : opts.react ? 'react'
    : opts.typescript ? 'typescript'
    : 'base';

  const eslintContent = `import config from '@merrywhether/config/eslint';

export default [
  ...config.${eslintConfig},
];
`;

  const eslintFile = path.resolve(process.cwd(), 'eslint.config.mjs');

  fs.writeFile(eslintFile, eslintContent, (e) => {
    if (e) {
      console.error('Error writing eslint config:\n', e);
    }
  });
}

if (opts.prettier) {
  const prettierContent = `import config from '@merrywhether/config/prettier';

export default {
  ...config,
};
`;
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
}
`;
  const renovateFile = path.resolve(process.cwd(), 'renovate.json');

  fs.writeFile(renovateFile, renovateContent, (e) => {
    if (e) {
      console.error('Error writing renovatre config:\n', e);
    }
  });
}

if (opts.typescript) {
  const typescriptConfig =
    opts.solid ? 'ts-solid'
    : opts.styled ? 'ts-styled'
    : 'ts-base';

  const typescriptContent = `{
  "extends": "@merrywhether/config/${typescriptConfig}",
  "compilerOptions": {},
  "exclude": ["node_modules"]
}
`;
  const typescriptFile = path.resolve(process.cwd(), 'tsconfig.json');

  fs.writeFile(typescriptFile, typescriptContent, (e) => {
    if (e) {
      console.error('Error writing typescript config:\n', e);
    }
  });
}
