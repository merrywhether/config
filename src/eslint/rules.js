// https://eslint.org/docs/latest/rules/
const eslintRules = {
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  // https://eslint.org/docs/latest/rules/no-unused-expressions
  'no-unused-expressions': [
    'error',
    { allowShortCircuit: true, enforceForJSX: true },
  ],
  // https://eslint.org/docs/latest/rules/no-useless-computed-key
  'no-useless-computed-key': 'error',
  'prefer-const': 'error',
  // https://eslint.org/docs/latest/rules/prefer-template
  'prefer-template': 'error',
  // https://eslint.org/docs/latest/rules/symbol-description
  'symbol-description': 'error',
  'valid-typeof': ['error', { requireStringLiterals: true }],
};

// https://github.com/un-ts/eslint-plugin-import-x
const importXRules = {
  // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/first.md
  'import-x/first': 'error',
  // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/newline-after-import.md
  'import-x/newline-after-import': 'error',
  // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
  'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
  // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-useless-path-segments.md
  'import-x/no-useless-path-segments': ['error'],
};

// https://typescript-eslint.io/rules/
const tsBaseRules = {
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { fixStyle: 'inline-type-imports' },
  ],
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unused-expressions': [
    'error',
    { allowShortCircuit: true, enforceForJSX: true },
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
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
};

// https://eslint-react.xyz/docs/rules/overview
const reactRules = {
  '@eslint-react/naming-convention/filename-extension': 'error',
  '@eslint-react/naming-convention/use-state': 'error',
  '@eslint-react/prefer-shorthand-boolean': 'error',
};

export const rules = {
  eslint: eslintRules,
  importX: importXRules,
  react: reactRules,
  tsBase: tsBaseRules,
  tsType: tsTypeRules,
};
