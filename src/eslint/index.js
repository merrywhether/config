// @ts-nocheck

import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import hooksPlugin from 'eslint-plugin-react-hooks';
import solidRecommended from 'eslint-plugin-solid/dist/configs/typescript.js';
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import tsSortKeysPlugin from 'eslint-plugin-typescript-sort-keys';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';
import { rules } from './rules.js';

const tsFiles = ['**/*.{ts,tsx,mtsx}'];
const allFiles = ['**/*.{js,mjs,cjs,jsx,mjsx}', ...tsFiles];

const base = config({
  files: allFiles,
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: 'error',
  },
  name: 'mw-config/base',
  plugins: {
    // eslint flat: https://github.com/import-js/eslint-plugin-import/issues/2556
    // eslint v9: https://github.com/import-js/eslint-plugin-import/issues/2948
    import: importPlugin,
    // eslint v9: https://github.com/mthadley/eslint-plugin-sort-destructure-keys/issues/266
    'sort-destructure-keys': sortDestructureKeysPlugin,
    'sort-keys-fix': sortKeysFixPlugin,
  },
  rules: {
    ...rules.eslint,
    ...rules.import,
    ...rules.sortKeys,
  },
});

const ts = config({
  extends: [
    // eslint v9: https://github.com/typescript-eslint/typescript-eslint/issues/8211
    ...tsConfigs.recommendedTypeChecked,
    ...tsConfigs.stylisticTypeChecked,
  ],
  files: tsFiles,
  languageOptions: {
    parserOptions: {
      project: true,
    },
  },
  name: 'mw-config/ts',
  plugins: {
    // eslint v9: https://github.com/infctr/eslint-plugin-typescript-sort-keys/issues/77
    'typescript-sort-keys': tsSortKeysPlugin,
  },
  rules: {
    ...tsSortKeysPlugin.configs.recommended.rules,
    ...rules.tsBase,
    ...rules.tsType,
  },
});

const react = config({
  extends: [
    // eslint v9: https://github.com/jsx-eslint/eslint-plugin-react/issues/3699
    reactRecommended,
    reactJsx,
  ],
  files: allFiles,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  name: 'mw-config/react',
  plugins: {
    // eslint v9: https://github.com/facebook/react/pull/28773
    'react-hooks': hooksPlugin,
  },
  rules: {
    ...rules.react,
    ...hooksPlugin.configs.recommended.rules,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
});

const solid = config({
  extends: [
    // eslint v9: https://github.com/solidjs-community/eslint-plugin-solid/issues/137
    solidRecommended,
  ],
  files: allFiles,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  name: 'mw-config/solid',
  plugins: {
    react: reactPlugin,
  },
  // we add a few useful JSX rules from React
  rules: rules.solidReact,
  settings: {
    react: {
      version: 'latest',
    },
  },
});

// prettier always last
export default {
  base: [js.configs.recommended, ...base, prettierRecommended],
  react: [
    js.configs.recommended,
    ...base,
    ...ts,
    ...react,
    prettierRecommended,
  ],
  solid: [
    js.configs.recommended,
    ...base,
    ...ts,
    ...solid,
    prettierRecommended,
  ],
  typescript: [js.configs.recommended, ...base, ...ts, prettierRecommended],
};
