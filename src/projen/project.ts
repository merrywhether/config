import {
  License,
  type LicenseOptions,
  Project,
  type ProjectOptions,
} from 'projen';

import { MwEslint, type MwEslintOpts } from './eslint.ts';
import { MwMiseConfig, type MwMiseConfigOpts } from './mise.ts';
import { MwPrettier, type MwPrettierOpts } from './prettier.ts';
import { getRenovatebotOptions, type RenovatebotPreset } from './renovate.ts';
import { MwTsConfig, type MwTsConfigOpts } from './typescript.ts';
import { genFilePath, setMjs } from './util/index.ts';

export interface MwProjectOpts {
  eslint: EslintOpts;
  license?: '_skip_' | LicenseOptions;
  mise?: MwMiseConfigOpts;
  prettier?: Pick<MwPrettierOpts, 'customConfig'>;
  renovatebotPreset?: RenovatebotPreset;
  typescript?: MwProjectTsConfig & MwTsConfigOpts;
  /** set to override autodetection */
  useMjs?: boolean;
}

type EslintOpts = Partial<Pick<MwEslintOpts, 'customConfig' | 'ignores'>>
  & Pick<MwEslintOpts, 'preset'>;

interface MwProjectTsConfig {
  excludeGenFiles?: boolean;
}

export class MwProject extends Project {
  readonly customConfigFile: string | undefined;

  constructor({
    eslint: { ignores: eslintIgnores = [], ...eslint },
    gitIgnoreOptions,
    license = { copyrightOwner: 'Risto Keravuori', spdx: 'MIT' },
    mise = { version: 'lts' },
    prettier = {},
    renovatebotOptions = {},
    renovatebotPreset,
    typescript: {
      excludeGenFiles: tsExcludeGenFiles,
      include: tsInclude,
      ...typescript
    } = {},
    useMjs,
    ...opts
  }: MwProjectOpts & Omit<ProjectOptions, 'renovatebot'>) {
    super({
      ...opts,
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
      renovatebot: !!renovatebotPreset,
      renovatebotOptions: getRenovatebotOptions(
        renovatebotPreset,
        renovatebotOptions,
      ),
    });

    setMjs(useMjs);

    this.customConfigFile =
      (eslint.customConfig ?? prettier.customConfig) ?
        genFilePath('mw.config.js')
      : undefined;

    const mwPrettier = new MwPrettier(this, prettier);

    const mwEslint = new MwEslint(this, {
      ...eslint,
      ignores: [mwPrettier.filePath, ...eslintIgnores],
    });

    if (license !== '_skip_') {
      new License(this, license);
    }

    new MwMiseConfig(this, mise);

    if (!tsExcludeGenFiles) {
      if (this.customConfigFile) {
        tsInclude?.unshift(this.customConfigFile);
      }
      tsInclude?.unshift(
        genFilePath('.projenrc.js'),
        mwEslint.filePath,
        mwPrettier.filePath,
      );
    }

    new MwTsConfig(this, { ...typescript, include: tsInclude ?? [] });
  }

  override preSynthesize(): void {
    // default task in Project doesn't have body
    this.defaultTask?.reset('node .projenrc.js');
  }
}
