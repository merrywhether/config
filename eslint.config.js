import config from '@merrywhether/config/eslint';

export default [
  {
    ignores: ['.github/'],
  },
  ...config.base,
];
