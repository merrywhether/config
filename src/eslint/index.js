// general ESLint v9 tracking issue:
// https://github.com/eslint/eslint/issues/18391

/** @import { ConfigArray } from 'typescript-eslint' */

import reactPlugin from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import importXPlugin from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { configs as reactHooksConfigs } from 'eslint-plugin-react-hooks';
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
  extends: [
    reactPlugin.configs.recommended,
    reactHooksConfigs['recommended-latest'],
  ],
  files: allFiles,
  name: 'mw-config/react',
  rules: { ...rules.react },
});

const solid = config({
  extends: [solidPlugin.configs['flat/typescript']],
  files: allFiles,
  name: 'mw-config/solid',
});

// prettier always last
/** @type  {Record<string, ConfigArray>} */
const configs = {
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

export default configs;
