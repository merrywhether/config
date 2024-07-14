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
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
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
  'no-unused-expressions': 'off',
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
  'react/no-children-prop': 'off',
  'react/no-invalid-html-attribute': 'error',
  'react/prop-types': 'off',
  'react/self-closing-comp': 'error',
};

const solidReactRules = {
  'react/jsx-boolean-value': 'error',
  'react/jsx-no-target-blank': 'error',
  'react/jsx-pascal-case': 'error',
  'react/no-unescaped-entities': 'error',
};

export const rules = {
  eslint: eslintRules,
  importX: importXRules,
  react: reactRules,
  solidReact: solidReactRules,
  tsBase: tsBaseRules,
  tsType: tsTypeRules,
};
