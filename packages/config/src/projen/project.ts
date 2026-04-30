import { License, Project, type ProjectOptions } from 'projen';

import type {
  MwDepManagementConfig,
  MwFormattingConfig,
  MwLintingConfig,
  MwPnpmConfig,
  MwTypecheckConfig,
} from '../types.ts';

import { MwEslint } from './eslint.ts';
import { MwMiseConfig } from './mise.ts';
import { MwPnpmWorkspace } from './pnpm-workspace.ts';
import { MwPrettier } from './prettier.ts';
import { getRenovatebotOptions } from './renovate.ts';
import { MwTsConfig, type MwTsConfigOpts } from './typescript.ts';
import { setMjs } from './util/index.ts';

export interface MwProjectOpts {
  copyright?: string;
  depManagement?: MwDepManagementConfig;
  /** Extra ESLint ignore patterns (escape hatch). */
  eslintIgnores?: string[];
  formatting?: MwFormattingConfig;
  gitIgnoreOptions?: ProjectOptions['gitIgnoreOptions'];
  /** Reserved for future use. */
  ignorePatterns?: boolean;
  license?: false | string;
  linting?: MwLintingConfig;
  mise?: false | string;
  name: string;
  pnpm?: MwPnpmConfig;
  renovatebotOptions?: ProjectOptions['renovatebotOptions'];
  typecheck?: MwTypecheckConfig;
  /** set to override autodetection */
  useMjs?: boolean;
}

export class MwProject extends Project {
  readonly customConfigFile: string | undefined;

  constructor({
    copyright = 'Risto Keravuori',
    depManagement = { tool: null },
    eslintIgnores = [],
    formatting = { tool: 'prettier' },
    gitIgnoreOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ignorePatterns: _ignorePatterns, // reserved for future use
    license = 'MIT',
    linting = { tool: 'eslint' },
    mise = 'lts',
    name,
    pnpm,
    renovatebotOptions = {},
    typecheck = { presets: ['base'], tool: 'typescript' },
    useMjs,
    ...opts
  }: MwProjectOpts & Omit<ProjectOptions, 'name' | 'renovatebot'>) {
    const enableRenovate =
      depManagement.tool === 'renovate' && !!depManagement.preset;
    const renovatePreset =
      depManagement.tool === 'renovate' ?
        (depManagement.preset as 'app' | 'package' | undefined)
      : undefined;

    super({
      ...opts,
      commitGenerated: true,
      gitIgnoreOptions: {
        ...gitIgnoreOptions,
        ignorePatterns: [
          ...(gitIgnoreOptions?.ignorePatterns ?? []),
          '.env*',
          '.cache/',
          '*.tsbuildinfo',
          '.DS_Store',
        ],
      },
      name,
      renovatebot: enableRenovate,
      ...(enableRenovate && {
        renovatebotOptions: getRenovatebotOptions(
          renovatePreset,
          renovatebotOptions,
        ),
      }),
    });

    setMjs(useMjs);

    const hasCustomConfig =
      !!(linting.tool === 'eslint' && linting.customConfig)
      || !!(formatting.tool === 'prettier' && formatting.customConfig);

    this.customConfigFile = hasCustomConfig ? 'mw.config.ts' : undefined;

    const mwPrettier =
      formatting.tool === 'prettier' ?
        new MwPrettier(this, {
          ...(formatting.customConfig !== undefined && {
            customConfig: formatting.customConfig,
          }),
        })
      : null;

    const mwEslint =
      linting.tool === 'eslint' ?
        new MwEslint(this, {
          ...(linting.customConfig !== undefined && {
            customConfig: linting.customConfig,
          }),
          ignores:
            mwPrettier ?
              [mwPrettier.filePath, ...eslintIgnores]
            : eslintIgnores,
          ...(linting.presets !== undefined && { presets: linting.presets }),
        })
      : null;

    if (license !== false) {
      new License(this, { copyrightOwner: copyright, spdx: license });
    }

    if (mise !== false) {
      new MwMiseConfig(this, { version: mise });
    }

    if (typecheck.tool === 'typescript') {
      const tsInclude: string[] = [...(typecheck.include ?? [])];

      // Prepend generated config files so they are type-checked
      const genFiles: string[] = [];
      if (mwEslint) genFiles.push(mwEslint.filePath);
      if (mwPrettier) genFiles.push(mwPrettier.filePath);
      genFiles.push('.projenrc.ts');
      if (this.customConfigFile) genFiles.push(this.customConfigFile);
      tsInclude.unshift(...genFiles);

      new MwTsConfig(this, {
        include: tsInclude,
        ...(typecheck.compilerOptions !== undefined ?
          { compilerOptions: typecheck.compilerOptions }
        : {}),
        ...(typecheck.presets !== undefined ?
          { presets: typecheck.presets }
        : {}),
      } satisfies Record<string, unknown> as MwTsConfigOpts);
    }

    new MwPnpmWorkspace(this, {
      ...(pnpm?.onlyBuiltDependencies !== undefined && {
        onlyBuiltDependencies: pnpm.onlyBuiltDependencies,
      }),
      ...(pnpm?.packages !== undefined && { packages: pnpm.packages }),
    });

    this.gitattributes.addAttributes(
      '/pnpm-lock.yaml',
      'linguist-generated=true',
    );
  }

  override preSynthesize(): void {
    // default task in Project doesn't have body
    this.defaultTask?.reset('node .projenrc.ts');
  }
}
