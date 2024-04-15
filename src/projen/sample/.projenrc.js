import { MwProject } from '@merrywhether/config';

const project = new MwProject({
  commitGenerated: true,
  eslint: {
    preset: 'typescript',
  },
  projenCommand: 'pn pj',
  typescript: {
    include: ['src'],
  },
});

project.synth();
