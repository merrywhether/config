import { MwProject } from '@merrywhether/config';

const project = new MwProject({
  commitGenerated: true,
  eslint: {
    preset: 'typescript',
  },
  name: '__NAME__',
  projenCommand: 'pn pj',
  typescript: {
    include: ['src'],
  },
});

project.synth();
