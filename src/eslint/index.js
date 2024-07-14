// @ts-nocheck

// general ESLint v9 tracking issue:
// https://github.com/eslint/eslint/issues/18391

import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import solidRecommended from 'eslint-plugin-solid/dist/configs/typescript.js';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';

import { rules } from './rules.js';

const tsFiles = ['**/*.{ts,tsx,mtsx}'];
const allFiles = ['**/*.{js,mjs,cjs,jsx,mjsx}', ...tsFiles];

const base = config({
  extends: [perfectionistNatural],
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
  },
  rules: {
    ...rules.eslint,
    ...rules.import,
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
  rules: {
    ...rules.tsBase,
    ...rules.tsType,
  },
});

const react = config({
  extends: [
    // eslint v9:
    // - issue: https://github.com/jsx-eslint/eslint-plugin-react/issues/3699
    // - PR: https://github.com/jsx-eslint/eslint-plugin-react/pull/3727
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
    // eslint v9: https://github.com/facebook/react/pull/28773 (official in React 19)
    // eslint flat config: https://github.com/facebook/react/issues/28313
    'react-hooks': fixupPluginRules(reactHooksPlugin),
  },
  rules: {
    ...rules.react,
    ...reactHooksPlugin.configs.recommended.rules,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
});

const solid = config({
  extends: [solidRecommended],
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
