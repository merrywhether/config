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
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
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
    'no-useless-computed-key': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys': ['error', 'asc', { natural: true }],
    // typescript
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/sort-type-union-intersection-members': 'error',
    // typescript (type-aware)
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    // import
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-cycle': 'error',
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
    'react/no-array-index-key': 'error',
    'react/no-children-prop': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    // hooks
    'react-hooks/exhaustive-deps': 'error',
  },
  overrides: [
    // next app pages require a default export
    {
      files: ['**/pages/*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
