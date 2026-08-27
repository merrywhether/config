import config from '@merrywhether/config/eslint';

export default {
  // config.solid is a ConfigArray whose sub-configs match broad globs by
  // default; rescope each to just the solid playground file so it doesn't
  // fight the react preset applied to everything else in this repo.
  eslint: config.solid.map((subConfig) => ({
    ...subConfig,
    files: ['playground/solid.tsx'],
  })),
};
