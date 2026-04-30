import { MwProject, type MwTypecheckConfig } from '@merrywhether/config';
import { readFileSync } from 'node:fs';

const { name } = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  name: string;
};

// isolatedDeclarations: false requires a cast because projen's type is pending update
const typecheck: MwTypecheckConfig = {
  compilerOptions: { allowJs: true, checkJs: true, types: ['node'] },
  include: ['src', 'scripts', 'playground'],
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
  pnpm: { onlyBuiltDependencies: ['unrs-resolver'] },
  renovatebotOptions: {
    overrideConfig: {
      // repo requires approvals
      automerge: true,
    },
  },
  typecheck,
}).synth();
