# Skill: create-mw-preset

Teaches Claude Code how to scaffold a new `@merrywhether/config` preset package.

## Overview

A preset package (`MwPreset`) declares what tooling configurations are available
and provides their implementations. Consumer projects import a preset and pass it
to `defineConfig` to override the built-in defaults.

## When to create a preset

Create a preset package when you need to:
- Share a custom ESLint/TypeScript/Prettier configuration across multiple
  repositories
- Override the built-in tool defaults for an organisation
- Add support for tools not yet in the built-in preset

## Package structure

```
packages/my-preset/
  src/
    index.ts          # Default export: the MwPreset object
  package.json
  tsconfig.json
  README.md
```

## Minimal preset

```typescript
// src/index.ts
import type { MwPreset } from '@merrywhether/config';

const preset: MwPreset = {
  metadata: {
    linting: {
      defaultTool: 'eslint',
      tools: {
        eslint: {
          label: 'ESLint',
          selectionMode: 'multi',
          default: ['typescript'],
          presets: {
            base: {
              label: 'Base',
              description: 'JS fundamentals',
            },
            typescript: {
              label: 'TypeScript',
              description: 'TypeScript-eslint recommended',
            },
          },
        },
      },
    },
    formatting: {
      defaultTool: 'prettier',
      tools: {
        prettier: {
          label: 'Prettier',
          selectionMode: 'single',
          default: 'default',
          presets: {
            default: {
              label: 'Default',
              description: 'Standard Prettier config',
            },
          },
        },
      },
    },
  },
};

export default preset;
```

## MwPreset type reference

```typescript
interface MwPreset {
  metadata: MwPresetMetadata;
}

interface MwPresetMetadata {
  linting?: MwCategoryDef<'eslint' | 'oxlint' | 'biome'>;
  formatting?: MwCategoryDef<'prettier' | 'biome' | 'oxfmt'>;
  depManagement?: MwCategoryDef<'renovate' | 'dependabot'>;
  typecheck?: MwCategoryDef<'typescript'>;
  runtime?: MwCategoryDef<'mise'>;
  packageManager?: MwCategoryDef<'pnpm' | 'npm' | 'yarn' | 'bun'>;
}

interface MwCategoryDef<TTools extends string> {
  defaultTool: TTools | null;
  tools: Partial<Record<TTools, MwToolDef>>;
}

interface MwToolDef {
  label: string;
  selectionMode: 'single' | 'multi';
  default: string | string[];          // string[] when selectionMode is 'multi'
  presets: Record<string, {
    label: string;
    description: string;
    peerDeps?: string[];               // TUI warns if these are not installed
  }>;
}
```

## package.json for the preset

```json
{
  "name": "@my-org/mw-preset",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "peerDependencies": {
    "@merrywhether/config": ">=6"
  }
}
```

## Validating the preset

Use the `validatePreset` utility from `@merrywhether/config` to verify the preset
passes all shape checks. Call it in your CI or test setup:

```typescript
import { validatePreset } from '@merrywhether/config';
import myPreset from './src/index.ts';

const result = validatePreset(myPreset);
if (!result.pass) {
  console.error('Preset validation failed:');
  for (const error of result.errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}
console.log('Preset valid ✓');
```

Add this as a `validate` script in your `package.json`:
```json
"scripts": {
  "validate": "node --input-type=module --eval 'import(\"./scripts/validate.ts\")'",
  "ci": "pnpm tc && pnpm validate"
}
```

Or use it directly in a test file with your test runner.

## Using the preset in a consumer project

```typescript
// mw.config.ts in the consumer project
import { defineConfig } from '@merrywhether/config';
import myPreset from '@my-org/mw-preset';

export default defineConfig({
  preset: myPreset,
  project: {
    linting: { tool: 'eslint', presets: ['typescript'] },
    // ... rest of config
  },
});
```

## Rules for selectionMode

- `'single'` → `default` must be a `string`, TUI shows radio buttons
- `'multi'` → `default` must be `string[]`, TUI shows checkboxes

## Common mistakes

1. **Wrong `default` type**: If `selectionMode: 'multi'`, `default` must be
   `string[]`, not a plain string. `validatePreset` catches this.
2. **Missing `label` or `description`**: Every preset entry needs both.
   `validatePreset` catches missing fields.
3. **Declaring `peerDeps` that are not actually needed**: Keep `peerDeps` to
   packages the consumer must install for that preset to function.

## Checklist before publishing

- [ ] `validatePreset(myPreset)` returns `{ pass: true, errors: [] }`
- [ ] All declared `peerDeps` are documented in README
- [ ] `exports` map points to `.ts` source (Node >=23.6.0 type stripping)
- [ ] `peerDependencies` includes `@merrywhether/config`
- [ ] Tested in a real consumer project via `pnpm link` or workspace
