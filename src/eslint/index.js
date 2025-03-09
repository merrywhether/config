// general ESLint v9 tracking issue:
// https://github.com/eslint/eslint/issues/18391

import reactPlugin from '@eslint-react/eslint-plugin';
import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import importXPlugin from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
// @ts-expect-error: no types yet
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import solidPlugin from 'eslint-plugin-solid';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';

import { rules } from './rules.js';

const tsFiles = ['**/*.{ts,tsx,mtsx}'];
const allFiles = ['**/*.{js,mjs,cjs,jsx,mjsx}', ...tsFiles];

const base = config({
  extends: [perfectionist.configs['recommended-natural']],
  files: allFiles,
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
  linterOptions: {
    reportUnusedDisableDirectives: 'error',
    reportUnusedInlineConfigs: 'error',
  },
  name: 'mw-config/base',
  plugins: { 'import-x': importXPlugin },
  rules: { ...rules.eslint, ...rules.importX },
});

const ts = config({
  extends: [
    ...tsConfigs.recommendedTypeChecked,
    ...tsConfigs.stylisticTypeChecked,
  ],
  files: tsFiles,
  languageOptions: { parserOptions: { projectService: true } },
  name: 'mw-config/ts',
  rules: { ...rules.tsBase, ...rules.tsType },
});

const react = config({
  extends: [reactPlugin.configs.recommended],
  files: allFiles,
  name: 'mw-config/react',
  plugins: {
    // eslint v9: https://github.com/facebook/react/pull/28773 (official in React 19)
    // eslint flat config: https://github.com/facebook/react/issues/28313
    'react-hooks': fixupPluginRules(reactHooksPlugin),
  },
  rules: { ...rules.react, ...reactHooksPlugin.configs.recommended.rules },
});

const solid = config({
  extends: [solidPlugin.configs['flat/typescript']],
  files: allFiles,
  name: 'mw-config/solid',
});

// prettier always last
export default {
  base: config([js.configs.recommended, ...base, prettierRecommended]),
  react: config([
    js.configs.recommended,
    ...base,
    ...ts,
    ...react,
    prettierRecommended,
  ]),
  solid: config([
    js.configs.recommended,
    ...base,
    ...ts,
    ...solid,
    prettierRecommended,
  ]),
  typescript: config([
    js.configs.recommended,
    ...base,
    ...ts,
    prettierRecommended,
  ]),
};
