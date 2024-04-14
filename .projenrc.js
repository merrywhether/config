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
  renovatebotPreset: 'package',
  typescript: {
    compilerOptions: {
      checkJs: true,
    },
    extends: './src/ts/base',
    include: ['src', 'scripts'],
    preset: '_skip_',
  },
});

project.synth();
