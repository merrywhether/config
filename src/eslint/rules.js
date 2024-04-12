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

const sortKeysRules = {
  'sort-destructure-keys/sort-destructure-keys': [
    'error',
    { caseSensitive: true },
  ],
  'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }],
};

const tsBaseRules = {
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

const tsTypeRules = {
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  '@typescript-eslint/no-misused-promises': [
    'error',
    { checksVoidReturn: { attributes: false } },
  ],
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
};

const reactRules = {
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
};

const solidReactRules = {
  'react/jsx-boolean-value': 'error',
  'react/jsx-no-target-blank': 'error',
  'react/jsx-pascal-case': 'error',
  'react/jsx-sort-props': 'error',
  'react/no-unescaped-entities': 'error',
};

export const rules = {
  eslint: eslintRules,
  import: importRules,
  react: reactRules,
  solidReact: solidReactRules,
  sortKeys: sortKeysRules,
  tsBase: tsBaseRules,
  tsType: tsTypeRules,
};
