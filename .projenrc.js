import { MwProject } from '@merrywhether/config';

const project = new MwProject({
  commitGenerated: true,
  eslint: {
    ignores: ['@types'],
    preset: 'typescript',
  },
  gitIgnoreOptions: {
    ignorePatterns: ['@types'],
  },
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
      checkJs: true,
    },
    include: ['src', 'scripts'],
  },
});

project.synth();
