module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
  },
  reportUnusedDisableDirectives: true,
  plugins: [
    '@typescript-eslint',
    'import',
    'react',
    'react-hooks',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],
  rules: {
    // eslint
    curly: 'error',
    eqeqeq: 'error',
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
    // typescript
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/sort-type-union-intersection-members': 'error',
    // typescript (type-aware)
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
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
    // react
    'react/display-name': [2, { ignoreTranspilerName: true }],
    'react/jsx-boolean-value': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-array-index-key': 'error',
    'react/no-children-prop': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    // react hooks
    'react-hooks/exhaustive-deps': 'error',
    // sort destructure
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: true },
    ],
    // sort keys
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }],
  },
  overrides: [
    // next app pages require a default export
    {
      files: ['**/pages/**'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
  ],
};
