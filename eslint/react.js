// const base = require.resolve('./base');

module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/hook-use-state': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-children-prop': 'off',
    'react/no-invalid-html-attribute': 'error',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
