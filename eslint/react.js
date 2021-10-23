// const base = require.resolve('./base');

module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    // react
    'react/display-name': [2, { ignoreTranspilerName: true }],
    'react/jsx-boolean-value': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-array-index-key': 'error',
    'react/no-children-prop': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    // react hooks
    'react-hooks/exhaustive-deps': 'error',
  },
  overrides: [
    // next app pages require a default export
    {
      files: ['**/pages/**'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
