# &#64;merrywhether/config

[![npm version](https://badge.fury.io/js/%40merrywhether%2Fconfig.svg)](https://www.npmjs.com/package/%40merrywhether%2Fconfig)
[![Renovate dashboard](https://david-dm.org/merrywhether/config.svg)](https://app.renovatebot.com/dashboard)

Common config files for &#64;merrywhether projects

## Usage

Installation:

```sh
yarn add -D @merrywhether/config
```

Use this is via invoking its executable from the root of your app (or the
directory where you want the config files created):

```sh
yarn mw-config
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

The defaults are controlled by the `--default`/`-d` flag, which defaults to
`true`. Disabling the default enables a la carte selection of any of the other
targeted options.

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
- [`typescript-sort-keys`](https://github.com/infctr/eslint-plugin-typescript-sort-keys#usage)
  (recommended)

When the `react` option is selected, the following are added:

- [`react`](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules)
  (recommended++, jsx-runtime)
- [`react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation)
  (recommended++)

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
[`typescript-styled-plugin`](https://github.com/microsoft/typescript-styled-plugin#configuration)
is added.

When the `solid` option is selected, the `jsxImportSource` is appropriately
updated.
