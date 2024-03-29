const baseRules = {
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { fixStyle: 'inline-type-imports' },
  ],
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  // pending https://github.com/typescript-eslint/typescript-eslint/issues/2296
  // '@typescript-eslint/member-ordering': [
  //   'error',
  //   {
  //     default: { optionalityOrder: 'required-first', order: 'alphabetically' },
  //   },
  // ],
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unused-expressions': [
    'error',
    { enforceForJSX: true },
  ],
  '@typescript-eslint/sort-type-constituents': 'error',
  'no-unused-expressions': 'off',
  'typescript-sort-keys/interface': [
    'error',
    // `requiredFirst: true` is only non-default value
    'asc',
    { caseSensitive: true, natural: false, requiredFirst: true },
  ],
};

const typeRules = {
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  '@typescript-eslint/no-misused-promises': [
    'error',
    { checksVoidReturn: { attributes: false } },
  ],
  '@typescript-eslint/no-throw-literal': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
};

module.exports = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:typescript-sort-keys/recommended',
      ],
      // only enable TS rules for TS files
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
      rules: {
        ...baseRules,
        ...typeRules,
      },
    },
  ],
};
