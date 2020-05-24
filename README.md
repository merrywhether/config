# &#64;merrywhether/config

[![npm version](https://badge.fury.io/js/%40merrywhether%2Fconfig.svg)](https://www.npmjs.com/package/%40merrywhether%2Fconfig)

Common config files for &#64;merrywhether projects

## Usage

Installation:

```sh
yarn add -D @merrywhether/config
```

The easiest way to use this is via invoking its executable from the root of your
app (or the directory where you want the config files created):

```sh
yarn mw-config -EpT
```

This will generate the requested config files for you, and it supports the
following flags:

- `--eslint-react` / `-E`
- `--prettier` / `-p`
- `--ts` / `-t`
- `--ts-styled` / `-T`

Upon completion, it will print the required `yarn add` command for all of the
corresponding dependencies.

Alternatively, you can use the examples in the next section.

## Available configuration files with dependencies and usage

- .eslintrc-ts-react.js

  `yarn add -D eslint eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks`

  `module.exports = require('@merrywhether/config/.eslintrc-ts-react.js');`

- prettier.config.js

  `yarn add -D prettier`

  `module.exports = require('@merrywhether/config/prettier.config.js');`

- tsconfig.json

  `yarn add -D typescript`

  ```
  {
    "extends": "@merrywhether/config/tsconfig.json",
    "include": ["src/**/*"]
  }
  ```

- tsconfig-styled.json

  `yarn add -D typescript typescript-styled-plugin`

  ```
  {
    "extends": "@merrywhether/config/tsconfig-styled.json",
    "include": ["src/**/*"]
  }
  ```
