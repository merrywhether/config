// general ESLint v9 tracking issue:
// https://github.com/eslint/eslint/issues/18391

/** @import { ConfigArray } from 'typescript-eslint' */

import reactPlugin from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import solidPlugin from 'eslint-plugin-solid';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

import { rules } from './rules.js';

const tsFiles = ['**/*.{ts,tsx,mtsx}'];
const allFiles = ['**/*.{js,mjs,cjs,jsx,mjsx}', ...tsFiles];

const base = defineConfig({
  // @ts-expect-error: plugin type mismatch, fixed in next plugin release
  extends: [perfectionist.configs['recommended-natural']],
  files: allFiles,
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
  linterOptions: {
    reportUnusedDisableDirectives: 'error',
    reportUnusedInlineConfigs: 'error',
  },
  name: 'mw-config/base',
  // @ts-expect-error: plugin type mismatch
  plugins: { 'import-x': importX },
  rules: { ...rules.eslint, ...rules.importX },
});

const ts = defineConfig({
  extends: [
    ...tsConfigs.recommendedTypeChecked,
    ...tsConfigs.stylisticTypeChecked,
  ],
  files: tsFiles,
  languageOptions: { parserOptions: { projectService: true } },
  name: 'mw-config/ts',
  rules: { ...rules.tsBase, ...rules.tsType },
});

const reactCommon = defineConfig({
  extends: [
    reactPlugin.configs.strict,
    reactHooksPlugin.configs.flat['recommended-latest'],
  ],
  files: allFiles,
  name: 'mw-config/react-common',
  rules: { ...rules.react },
});

const reactTypeChecked = defineConfig({
  extends: [reactPlugin.configs['strict-type-checked']],
  files: tsFiles,
  name: 'mw-config/react-type-checked',
});

const solid = defineConfig({
  // @ts-expect-error: plugin type mismatch
  extends: [solidPlugin.configs['flat/typescript']],
  files: allFiles,
  name: 'mw-config/solid',
});

// prettier always last
/** @type  {Record<string, ConfigArray>} */
const configs = {
  base: defineConfig([js.configs.recommended, ...base, prettierRecommended]),
  react: defineConfig([
    js.configs.recommended,
    ...base,
    ...ts,
    ...reactCommon,
    ...reactTypeChecked,
    prettierRecommended,
  ]),
  solid: defineConfig([
    js.configs.recommended,
    ...base,
    ...ts,
    ...solid,
    prettierRecommended,
  ]),
  typescript: defineConfig([
    js.configs.recommended,
    ...base,
    ...ts,
    prettierRecommended,
  ]),
};

export default configs;
