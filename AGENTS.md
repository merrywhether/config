# AGENTS.md — @merrywhether/config monorepo

Guidance for agentic coding agents working in this repository.

## Project Overview

This is a pnpm monorepo publishing three packages:

- **`@merrywhether/config`** — ESLint, Prettier, and TypeScript configs plus a
  [projen](https://projen.io) project type (`MwProject`) that scaffolds and
  manages config files in downstream projects.
- **`@merrywhether/mw-preset`** — The built-in tool preset (eslint, prettier,
  renovate, typescript, mise presets).
- **`@merrywhether/mw-config`** — Interactive CLI (`mw-config`) that configures
  consumer projects via a TUI or `--describe` flag for LLM agents.

All packages are `"type": "module"` (ESM only). Node >=24.15.0 is required.
Package manager is **pnpm**. Types ship as `.ts` source — no build step.

---

## Commands

### Install

```sh
pnpm install
```

### Type-check (all packages)

```sh
pnpm tc            # runs tsc --noEmit in each package
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
pnpm pj            # node .projenrc.ts  (alias: pn pj)
```

### CI equivalent (full check)

```sh
pnpm tc && pnpm lint:es && pnpm lint:md
```

> **Note:** There are no automated tests in this repo. Correctness is verified
> through type-checking (`pnpm tc`) and linting (`pnpm lint`). The `playground/`
> directory contains ad-hoc TSX files used to manually exercise the ESLint/TS
> configs.

---

## Repository Structure

```
packages/
  config/       # @merrywhether/config
    src/
      eslint/       # ESLint config compositions (index.ts, rules.ts)
      ts/           # TypeScript base JSON configs (base, solid, styled, vue)
      projen/       # MwProject projen component and helpers
        util/       # Module/node/package-type utilities
      prettier.ts   # Prettier config export
      types.ts      # Shared types (MwConfig, MwPreset, etc.)
      validatePreset.ts  # validatePreset utility for preset authors
  mw-preset/    # @merrywhether/mw-preset
    src/
      index.ts      # builtinPreset - the default preset shipped with @merrywhether/config
  mw-config/    # @merrywhether/mw-config (CLI binary)
    src/
      index.ts        # CLI entry point (bin: mw-config)
      config-loader.ts
      pkg-manager.ts
      agents-md.ts
      first-run.ts
      git-config.ts
      skill-file.ts
      tui/
        App.tsx         # ink TUI component
        config-writer.ts
playground/         # Manual test files (not published)
.projenrc.ts        # Projen config for this repo itself
```

---

## Projen-managed Files

The following files at the **root** are **auto-generated** by projen (`pnpm pj`).
Do **not** edit them directly — edit `.projenrc.ts` and re-run `pnpm pj`:

- `eslint.config.ts`
- `prettier.config.ts`
- `tsconfig.json`
- `.mise.toml`
- `.gitignore`
- `.gitattributes`
- `renovate.json5`
- `pnpm-workspace.yaml`

---

## Code Style

### Language & Module Format

- All source files are **ESM** (`.ts`, `.tsx`).
- Use `.ts` extensions in import specifiers (Node 24.15.0 native type stripping
  resolves `.ts` imports directly).
- Node built-ins must use the `node:` prefix:
  `import { join } from 'node:path'`.

### TypeScript

- Explicit return types are required on all functions — write them intentionally
  rather than relying on inference or auto-insertion.
- No JSDoc type annotations — all types are native TypeScript.

### Imports & Formatting

Run `pnpm fix` after making changes — ESLint and Prettier will auto-correct
import order, object key order, type-import style, and formatting. Write code
that is correct; let the tools handle style.

### Naming Conventions

- React components: PascalCase files with `.tsx` extension.
- `useState` destructuring: `[value, setValue]` form.
- Use React 19 APIs: no `forwardRef`, no `useContext`, no `Context.Provider`
  wrapper (use `Context` directly).

### Error Handling

- Caught errors in `catch` blocks must always be referenced — add a comment if
  the error is genuinely ignorable (e.g. `// file not found`).
- Check `instanceof Error` before accessing `.message` on unknown values.

---

## Adding a New Projen Component

1. Create a class in `packages/config/src/projen/` extending a projen base
   (e.g., `SourceCode`, `TomlFile`, `Component`).
2. Export it from `packages/config/src/projen/index.ts`.
3. Wire it into `MwProject` in `packages/config/src/projen/project.ts` if it
   should be included by default.
4. Run `pnpm tc` to verify types.

## Modifying ESLint or Prettier Config

- ESLint rules live in `packages/config/src/eslint/rules.ts` — add to the
  appropriate rules object (eslint, importX, tsBase, tsType, react).
- Config presets are composed in `packages/config/src/eslint/index.ts`.
- Prettier config lives in `packages/config/src/prettier.ts`.
- After changes, run `pnpm fix` in this repo.

## Adding or Modifying TUI

- TUI code lives in `packages/mw-config/src/tui/App.tsx`.
- Config writer is in `packages/mw-config/src/tui/config-writer.ts`.
- Run `node packages/mw-config/src/index.ts` to test the TUI locally.

## Self-hosting verification

After any change, the canonical check is:

```sh
pnpm pj && git diff --exit-code
```

This re-synthesizes all projen-managed files and verifies nothing unintended
changed. If there's a diff, inspect it and either accept it (commit) or fix
the source.
