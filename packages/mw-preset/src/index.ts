import type { MwPreset } from '@merrywhether/config';

export const builtinPreset: MwPreset = {
  metadata: {
    depManagement: {
      defaultTool: null,
      tools: {
        dependabot: {
          default: 'default',
          label: 'Dependabot',
          presets: {
            default: {
              description: 'Standard Dependabot config',
              label: 'Default',
            },
          },
          selectionMode: 'single',
        },
        renovate: {
          default: 'app',
          label: 'Renovate',
          presets: {
            app: {
              description:
                'Groups non-majors, infrequent schedule, no lock file maintenance',
              label: 'App',
            },
            package: {
              description: 'Automerge patches, rebase when behind',
              label: 'Package',
            },
          },
          selectionMode: 'single',
        },
      },
    },
    formatting: {
      defaultTool: 'prettier',
      tools: {
        prettier: {
          default: 'default',
          label: 'Prettier',
          presets: {
            default: {
              description: 'Standard Prettier config',
              label: 'Default',
            },
          },
          selectionMode: 'single',
        },
      },
    },
    linting: {
      defaultTool: 'eslint',
      tools: {
        eslint: {
          default: ['typescript'],
          label: 'ESLint',
          presets: {
            base: {
              description:
                'JS fundamentals, import-x (ESM compliance), perfectionist',
              label: 'Base',
            },
            react: {
              description:
                'React hooks + @eslint-react strict + React 19 idioms (extends typescript)',
              label: 'React',
              peerDeps: [],
            },
            solid: {
              description:
                'eslint-plugin-solid flat/typescript (extends typescript)',
              label: 'Solid',
              peerDeps: ['eslint-plugin-solid'],
            },
            typescript: {
              description:
                'typescript-eslint recommended + stylistic type-checked (extends base)',
              label: 'TypeScript',
            },
            vue: {
              description:
                'eslint-plugin-vue vue3-recommended + Vue 3 composition idioms (extends typescript)',
              label: 'Vue',
              peerDeps: ['eslint-plugin-vue', 'vue-eslint-parser'],
            },
          },
          selectionMode: 'multi',
        },
      },
    },
    packageManager: {
      defaultTool: 'pnpm',
      tools: {
        bun: {
          default: 'default',
          label: 'Bun',
          presets: {
            default: { description: 'Standard Bun config', label: 'Default' },
          },
          selectionMode: 'single',
        },
        npm: {
          default: 'default',
          label: 'npm',
          presets: {
            default: { description: 'Standard npm config', label: 'Default' },
          },
          selectionMode: 'single',
        },
        pnpm: {
          default: 'default',
          label: 'pnpm',
          presets: {
            default: { description: 'Standard pnpm config', label: 'Default' },
          },
          selectionMode: 'single',
        },
        yarn: {
          default: 'default',
          label: 'Yarn',
          presets: {
            default: { description: 'Standard Yarn config', label: 'Default' },
          },
          selectionMode: 'single',
        },
      },
    },
    runtime: {
      defaultTool: 'mise',
      tools: {
        mise: {
          default: 'lts',
          label: 'mise',
          presets: {},
          selectionMode: 'single',
        },
      },
    },
    typecheck: {
      defaultTool: 'typescript',
      tools: {
        typescript: {
          default: ['base'],
          label: 'TypeScript',
          presets: {
            base: { description: 'Core strict settings', label: 'Base' },
            solid: { description: 'Solid-specific additions', label: 'Solid' },
            styled: {
              description: 'styled-components additions',
              label: 'Styled',
              peerDeps: ['@styled/typescript-styled-plugin'],
            },
            vue: {
              description: 'Adds @vue/typescript-plugin, includes **/*.vue',
              label: 'Vue',
              peerDeps: ['@vue/typescript-plugin'],
            },
          },
          selectionMode: 'multi',
        },
      },
    },
  },
};
