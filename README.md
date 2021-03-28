# &#64;merrywhether/config

[![npm version](https://badge.fury.io/js/%40merrywhether%2Fconfig.svg)](https://www.npmjs.com/package/%40merrywhether%2Fconfig)

Common config files for &#64;merrywhether projects

## Usage

Installation:

```sh
yarn add -D @merrywhether/config
```

Use this is via invoking its executable from the root of your app (or the
directory where you want the config files created):

```sh
yarn mw-config -ept
```

This will generate the requested config files for you, and it supports the
following flags:

- `--eslint` / `-e`
- `--prettier` / `-p`
- `--typescript` / `-t`

## Configs

### ESLint

Includes the following plugins:

- `@typescript-eslint`
- `import`
- `prettier`
- `react`
- `react-hooks`

Also includes a variety of specific extra rules, including type-aware linting.

### Prettier

Single quotes because this is JS! 😛

### Typescript

All the strict settings, and also typescript-styled-plugin.
