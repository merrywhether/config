# &#64;merrywhether/config

[![npm version](https://badge.fury.io/js/%40merrywhether%2Fconfig.svg)](https://www.npmjs.com/package/%40merrywhether%2Fconfig)
[![Renovate dashboard](https://img.shields.io/badge/dependencies%20by-renovate-%231A1F6C?logo=renovatebot)](https://app.renovatebot.com/dashboard)
[![Lint Status](https://github.com/merrywhether/config/actions/workflows/lint.yml/badge.svg)](https://github.com/merrywhether/config/actions/workflows/lint.yml?query=branch%3Amain)
[![Version](https://img.shields.io/badge/version++-black?logo=npm)](https://github.com/merrywhether/config/actions/workflows/version.yml)

Common config files for &#64;merrywhether projects

## Usage

Installation:

```sh
pnpm add -D @merrywhether/config
```

Use this is via invoking its executable from the root of your app (or the
directory where you want the config files created):

```sh
pnpm mw-config
```

This will generate your config files for you, with support for the following
options with corresponding effects:

| option     | alias | default set | Δ eslintrc | Δ prettier.config | Δ tsconfig |
| ---------- | ----- | ----------- | ---------- | ----------------- | ---------- |
| eslint     | e     | ✅          | ✅         |                   |            |
| prettier   | p     | ✅          | ✅         | ✅                |            |
| react      | r     |             | ✅         |                   |            |
| renovate   |       | ✅          |            |                   |            |
| solid      |       |             | ✅         |                   | ✅         |
| styled     |       |             |            |                   | ✅         |
| typescript | t     | ✅          | ✅         |                   | ✅         |

The defaults are controlled by the `--default`/`-d` flag.

## Configuration Details

### ESLint

The base ESLint configuration includes the following plugins/configs:

- [`eslint`](https://eslint.org/docs/rules/) (recommended++)
- [`import`](https://github.com/import-js/eslint-plugin-import#rules)
- [`prettier`](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)
  (recommended)
- [`sort-destructure-keys`](https://github.com/mthadley/eslint-plugin-sort-destructure-keys#usage)
- [`sort-keys-fix`](https://github.com/leo-buneev/eslint-plugin-sort-keys-fix#usage)

When the `typescript` option is selected, the following are added:

- [`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules)
  (recommended++, including type-aware)

When the `react` option is selected, the following are added:

- [`react`](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules)
  (recommended++, jsx-runtime)
- [`react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation)
  (recommended++)
- [`typescript-sort-keys`](https://github.com/infctr/eslint-plugin-typescript-sort-keys#usage)
  (recommended)

When the `solid` option is selected, the following are added:

- [`solid`](https://github.com/joshwilsonvu/eslint-plugin-solid#rules)
  (recommended)
- [`react`](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules)
  (JSX-specific rules)

### Prettier

Uses the [default Prettier settings](https://prettier.io/docs/en/options.html)
with the following changes:

- `singleQuote: true` (because this is JS! 😛)
- `trailingComma: all` (embrace the future)
- `proseWrap: always` (wrapping Markdown).

### Typescript

The base configuration has all of the strictest settings enabled and targets
`esnext`.

When the `styled` option is selected,
[`@styled/typescript-styled-plugin`](https://github.com/styled-components/typescript-styled-plugin)
is added.

When the `solid` option is selected, the `jsxImportSource` is appropriately
updated.
