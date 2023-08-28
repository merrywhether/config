const eslintRules = {
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'no-unused-expressions': ['error', { enforceForJSX: true }],
  'no-useless-computed-key': 'error',
  'prefer-const': 'error',
  'prefer-template': 'error',
  'sort-imports': ['error', { ignoreDeclarationSort: true }],
  'symbol-description': 'error',
  'valid-typeof': ['error', { requireStringLiterals: true }],
};

const importRules = {
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-cycle': 'error',
  'import/no-duplicates': ['error', { 'prefer-inline': true }],
  'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
  'import/order': [
    'error',
    {
      alphabetize: {
        order: 'asc',
        orderImportKind: 'asc',
      },
      'newlines-between': 'never',
    },
  ],
};

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['import', 'sort-destructure-keys', 'sort-keys-fix'],
  reportUnusedDisableDirectives: true,
  rules: {
    ...eslintRules,
    ...importRules,
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: true },
    ],
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }],
  },
};
