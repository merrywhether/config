// from https://github.com/JstnMcBrd/eslint-config/blob/main/src/%40types/eslint-plugin-react.d.ts

declare module 'eslint-plugin-react' {
  import type { ESLint } from 'eslint';

  const plugin: {
    // eslint-plugin-react does not use FlatConfig yet
    configs: Record<string, ESLint.ConfigData>;
  } & Omit<ESLint.Plugin, 'configs'>;
  export default plugin;
}

// from
// https://github.com/JstnMcBrd/eslint-config/blob/main/src/%40types/eslint-plugin-react-hooks.d.ts

declare module 'eslint-plugin-react-hooks' {
  import type { ESLint } from 'eslint';

  const plugin: {
    // eslint-plugin-react-hooks does not use FlatConfig yet
    configs: Record<string, ESLint.ConfigData>;
  } & Omit<ESLint.Plugin, 'configs'>;
  export default plugin;
}
