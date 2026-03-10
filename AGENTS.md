# AGENTS.md — @merrywhether/config

Guidance for agentic coding agents working in this repository.

## Project Overview

This is a shared configuration library (`@merrywhether/config`) that publishes
ESLint, Prettier, and TypeScript configs, plus a [projen](https://projen.io)
project type (`MwProject`) that scaffolds and manages config files in downstream
projects.

The package is `"type": "module"` (ESM only). Node >=24.12.0 is required (see
`.mise.toml`). Package manager is **pnpm**.

---

## Commands

### Install

```sh
pnpm install
```

### Build (generate declaration types)

```sh
pnpm build:types   # tsc -p tsconfig.build.json → @types/
```

### Type-check (no emit)

```sh
pnpm tc            # tsc --noEmit
```

### Lint

```sh
pnpm lint          # ESLint + Prettier check (both)
pnpm lint:es       # ESLint only
pnpm lint:md       # Prettier check on *.md files only
```

### Auto-fix

```sh
pnpm fix           # ESLint fix + Prettier write
pnpm lint:es:fix   # ESLint fix only
pnpm lint:md:fix   # Prettier write on *.md only
```

### Regenerate projen-managed config files

```sh
pnpm pj            # node .projenrc.js  (alias: pn pj)
```

### CI equivalent (full check)

```sh
pnpm build:types && pnpm tc && pnpm lint:es && pnpm lint:md
```

> **Note:** There are no automated tests in this repo. Correctness is verified
> through type-checking (`pnpm tc`) and linting (`pnpm lint`). The `playground/`
> directory contains ad-hoc TSX files used to manually exercise the ESLint/TS
> configs.

---

## Repository Structure

```
src/
  eslint/       # ESLint config compositions (index.js, rules.js)
  ts/           # TypeScript base JSON configs (base, solid, styled)
  projen/       # MwProject projen component and helpers
    util/       # Module/node/package-type utilities
    sample/     # Template files copied on postinstall
  prettier.js   # Prettier config export
scripts/
  postinstall.mjs   # Copies sample .projenrc.js on install
playground/         # Manual test files (not published)
@types/             # Generated declaration files (gitignored, built by pnpm build:types)
.projenrc.js        # Projen config for this repo itself
```

---

## Projen-managed Files

The following files are **auto-generated** by projen (`pnpm pj`). Do **not**
edit them directly — edit `.projenrc.js` and re-run `pnpm pj`:

- `eslint.config.js`
- `prettier.config.js`
- `tsconfig.json`
- `.mise.toml`
- `.gitignore`
- `renovate.json5`

---

## Code Style

### Language & Module Format

- All source files are **ESM** (`.js`, `.mjs`, `.ts`, `.tsx`).
- Use `.js` extensions in import specifiers (even when importing `.ts` source),
  matching `verbatimModuleSyntax` and Node's ESM resolution.
- Node built-ins must use the `node:` prefix:
  `import { join } from 'node:path'`.

### TypeScript

- Explicit return types are required on all functions — write them intentionally
  rather than relying on inference or auto-insertion.
- In `.js` files, use JSDoc for type annotations (`@param`, `@returns`,
  `@typedef`, `@import`). The `@import` tag is the preferred way to import types
  in JSDoc files:
  ```js
  /** @import { Foo } from './foo.js' */
  ```

### Imports & Formatting

Run `pnpm fix` after making changes — ESLint and Prettier will auto-correct
import order, object key order, type-import style, and formatting. Write code
that is correct; let the tools handle style.

### Naming Conventions

- React components: PascalCase files with `.tsx` extension.
- `useState` destructuring: `[value, setValue]` form.
- Context objects: PascalCase name.
- Use React 19 APIs: no `forwardRef`, no `useContext`, no `Context.Provider`
  wrapper (use `Context` directly).

### Error Handling

- Caught errors in `catch` blocks must always be referenced — add a comment if
  the error is genuinely ignorable (e.g. `// file not found`).
- Check `instanceof Error` before accessing `.message` on unknown values.

---

## Adding a New Projen Component

1. Create a class in `src/projen/` extending a projen base (e.g., `SourceCode`,
   `TomlFile`, `Component`).
2. Export it from `src/projen/index.js`.
3. Wire it into `MwProject` in `src/projen/project.js` if it should be included
   by default.
4. Re-run `pnpm build:types` to regenerate declarations, then `pnpm tc` to
   verify types.

## Modifying ESLint or Prettier Config

- ESLint rules live in `src/eslint/rules.js` — add to the appropriate rules
  object (eslint, importX, tsBase, tsType, react).
- Config presets are composed in `src/eslint/index.js`.
- Prettier config lives in `src/prettier.js`.
- After changes, run `pnpm fix` in this repo.
