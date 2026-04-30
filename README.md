# @merrywhether/config

[![npm version](https://badge.fury.io/js/%40merrywhether%2Fconfig.svg)](https://www.npmjs.com/package/%40merrywhether%2Fconfig)
[![Renovate dashboard](https://img.shields.io/badge/dependencies%20by-renovate-%231A1F6C?logo=renovatebot)](https://app.renovatebot.com/dashboard)
[![Lint Status](https://github.com/merrywhether/config/actions/workflows/static-analysis.yml/badge.svg)](https://github.com/merrywhether/config/actions/workflows/static-analysis.yml?query=branch%3Amain)

Common config files for @merrywhether projects. This monorepo publishes three
packages:

| Package                                                                            | Description                                               |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`@merrywhether/config`](https://www.npmjs.com/package/@merrywhether/config)       | ESLint, Prettier, TypeScript configs + projen `MwProject` |
| [`@merrywhether/mw-preset`](https://www.npmjs.com/package/@merrywhether/mw-preset) | Built-in tool preset                                      |
| [`@merrywhether/mw-config`](https://www.npmjs.com/package/@merrywhether/mw-config) | Interactive CLI (`mw-config`)                             |

## Quick Start

Run the interactive TUI in any project directory:

```sh
pnpm dlx @merrywhether/mw-config
```

This writes a `mw.config.ts` and a `.projenrc.ts`, then synthesizes all config
files (`eslint.config.ts`, `prettier.config.ts`, `tsconfig.json`, etc.).

For LLM agents, use the `--describe` flag to get a machine-readable summary of
the current configuration without launching the TUI:

```sh
pnpm dlx @merrywhether/mw-config --describe
```

## Manual Setup

Install the core package and add a `mw.config.ts`:

```sh
pnpm add -D @merrywhether/config
```

```ts
// mw.config.ts
import { defineConfig } from '@merrywhether/config';

export default defineConfig({
  eslint: { preset: 'typescript' },
  prettier: {},
  typecheck: { preset: 'base' },
});
```

Then run `node .projenrc.ts` to synthesize all config files.

## How It Works

`mw.config.ts` is the single source of truth. Generated files carry a
`DO NOT EDIT` header — edit `mw.config.ts` and re-run `node .projenrc.ts` (or
`pnpm pj` if the script is wired up) instead.

The `MwProject` projen component reads `mw.config.ts` and writes:

- `eslint.config.ts` — flat ESLint config
- `prettier.config.ts` — Prettier config
- `tsconfig.json` — TypeScript config
- `.mise.toml` — mise tool versions
- `renovate.json5` — Renovate dependency update config
- `pnpm-workspace.yaml` — (if pnpm workspaces enabled)

## ESLint Presets

| Preset       | Adds                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| `base`       | eslint recommended, import-x, prettier, sort-keys, sort-destructure-keys |
| `typescript` | @typescript-eslint (type-aware), typescript-sort-keys                    |
| `react`      | eslint-plugin-react, react-hooks, jsx-runtime                            |
| `solid`      | eslint-plugin-solid, react (JSX rules only)                              |
| `vue`        | eslint-plugin-vue, vue-eslint-parser                                     |

## Prettier Config

Uses [default Prettier settings](https://prettier.io/docs/en/options.html) with:

- `experimentalTernaries: true`
- `proseWrap: always`
- `singleQuote: true`

## TypeScript Presets

| Preset   | Description                             |
| -------- | --------------------------------------- |
| `base`   | Strictest settings, targets `esnext`    |
| `styled` | Adds `@styled/typescript-styled-plugin` |
| `solid`  | Sets `jsxImportSource: solid-js`        |
| `vue`    | Sets `jsxImportSource: vue`             |

## Custom Presets

Third-party packages can publish presets implementing the `MwPreset` interface.
Use `validatePreset` from `@merrywhether/config` to verify your preset at
runtime:

```ts
import { validatePreset } from '@merrywhether/config';
import type { MwPreset } from '@merrywhether/config';

const myPreset: MwPreset = {
  /* ... */
};
validatePreset(myPreset); // throws if invalid
export default myPreset;
```
