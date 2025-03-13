import { MwProject } from '@merrywhether/config';

const project = new MwProject({
  commitGenerated: true,
  eslint: { ignores: ['@types'], preset: 'react' },
  gitIgnoreOptions: { ignorePatterns: ['@types'] },
  name: '@merrywhether/config',
  projenCommand: 'pn pj',
  renovatebotOptions: {
    overrideConfig: {
      // repo requires approvals
      automerge: true,
    },
  },
  renovatebotPreset: 'package',
  typescript: {
    compilerOptions: {
      allowJs: true,
      checkJs: true,
      // required for allowJs
      // @ts-expect-error: pending type update in projen
      isolatedDeclarations: false,
    },
    include: ['src', 'scripts', 'playground'],
  },
  // pnpm 10 stopped populating this env var?
  useMjs: false,
});

project.synth();
