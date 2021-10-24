module.exports = {
  overrides: [
    {
      // only enable TS rules for TS files
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:typescript-sort-keys/recommended',
      ],
      rules: {
        // typescript
        '@typescript-eslint/consistent-indexed-object-style': 'error',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/default-param-last': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/init-declarations': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/sort-type-union-intersection-members': 'error',
        // typescript (type-aware)
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-meaningless-void-operator': 'error',
        '@typescript-eslint/no-throw-literal': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
  ],
};
