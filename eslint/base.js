module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  reportUnusedDisableDirectives: true,
  plugins: ['import', 'sort-destructure-keys', 'sort-keys-fix'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    // eslint
    curly: 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'guard-for-in': 'error',
    'keyword-spacing': ['error', { before: true, after: true }],
    'no-alert': 'error',
    'no-else-return': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': ['error', { enforceForJSX: true }],
    'no-useless-computed-key': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'symbol-description': 'error',
    'valid-typeof': ['error', { requireStringLiterals: true }],
    // import
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-default-export': 'error',
    'import/no-namespace': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'never',
      },
    ],
    // sort destructure
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: true },
    ],
    // sort keys
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }],
  },
  overrides: [
    // don't sort eslint files
    {
      files: ['**/*eslint*/**', '*eslint*'],
      rules: {
        'sort-keys-fix/sort-keys-fix': 'off',
      },
    },
  ],
};
