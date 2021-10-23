module.exports = {
  // we add a few useful JSX rules from React
  plugins: ['react'],
  extends: ['plugin:solid/recommended'],
  rules: {
    'react/jsx-boolean-value': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-unescaped-entities': 'error',
    'react/self-closing-comp': 'error',
  },
};
