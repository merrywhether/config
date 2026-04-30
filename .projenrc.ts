import { MwProject, type MwTypecheckConfig } from '@merrywhether/config';
import { readFileSync } from 'node:fs';
import { javascript } from 'projen';

const { name } = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  name: string;
};

// isolatedDeclarations: false requires a cast because projen's type is pending update
const typecheck: MwTypecheckConfig = {
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    jsx: javascript.TypeScriptJsxMode.REACT_JSX,
    types: ['node'],
  },
  include: [
    'packages/config/src',
    'packages/mw-preset/src',
    'packages/mw-config/src',
    'playground',
  ],
  presets: ['base'],
  tool: 'typescript',
};
// required for allowJs; pending type update in projen
(typecheck.compilerOptions as Record<string, unknown>).isolatedDeclarations =
  false;

new MwProject({
  copyright: 'Risto Keravuori',
  depManagement: { preset: 'package', tool: 'renovate' },
  eslintIgnores: ['@types'],
  formatting: { tool: 'prettier' },
  gitIgnoreOptions: { ignorePatterns: ['@types'] },
  linting: { presets: ['react'], tool: 'eslint' },
  name,
  pnpm: { onlyBuiltDependencies: ['unrs-resolver'], packages: ['packages/*'] },
  renovatebotOptions: {
    overrideConfig: {
      // repo requires approvals
      automerge: true,
    },
  },
  typecheck,
}).synth();
