import { MwProject } from '@merrywhether/config';

const project = new MwProject({
  commitGenerated: true,
  eslint: { customConfig: true, preset: 'react' },
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
      isolatedDeclarations: false,
      types: ['node'],
    },
    include: ['src', 'scripts', 'playground'],
  },
});

project.synth();
