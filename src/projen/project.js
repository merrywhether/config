/**
 * @import { LicenseOptions, ProjectOptions } from 'projen'
 * @import { config as tsEslintConfig } from "typescript-eslint"
 * @import { MwEslintOpts } from './eslint.js'
 * @import { MwMiseConfigOpts } from './mise.js'
 * @import { MwPrettierOpts } from './prettier.js'
 * @import { RenovatebotPreset } from './renovate.js'
 * @import { MwTsConfigOpts } from './typescript.js'
 */

import { join } from 'node:path';
import { License, Project, SampleFile, vscode } from 'projen';

import { MwEslint } from './eslint.js';
import { MwMiseConfig } from './mise.js';
import { MwPrettier } from './prettier.js';
import { getRenovatebotOptions } from './renovate.js';
import { MwTsConfig } from './typescript.js';
import { genFilePath, setMjs } from './util/index.js';

/**
 * @typedef {Object} MwCustomConfigFile
 * @prop {ReturnType<tsEslintConfig>} eslint
 * @prop {Record<string, unknown>} prettier
 *
 * @typedef {Object} MwProjectTsConfig
 * @prop {boolean} [excludeGenFiles]
 *
 * @typedef {Pick<MwEslintOpts, 'preset'> & Partial<Pick<MwEslintOpts, 'customConfig' | 'ignores' >>} EslintOpts
 *
 * @typedef {Object} MwProjectOpts
 * @prop {EslintOpts} eslint
 * @prop {LicenseOptions | '_skip_'} [license]
 * @prop {MwMiseConfigOpts} [mise]
 * @prop {Pick<MwPrettierOpts, 'customConfig'>} [prettier]
 * @prop {RenovatebotPreset} [renovatebotPreset]
 * @prop {MwProjectTsConfig & MwTsConfigOpts} [typescript]
 * @prop {boolean} [useMjs] set to override autodetection
 * @prop {Record<string, unknown>} [vscSettings]
 */

export class MwProject extends Project {
  /**
   * @param {string | undefined} customConfigFile
   */

  /**
   * @constructor
   * @param {MwProjectOpts & Omit<ProjectOptions, 'renovatebot'>} opts
   */
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
      include: tsInclude = [],
      ...typescript
    } = {},
    useMjs,
    vscSettings,
    ...opts
  }) {
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

    setMjs(useMjs ?? process.env.npm_package_type !== 'module');

    this.customConfigFile =
      eslint.customConfig || prettier.customConfig ?
        genFilePath('mw.config.js')
      : undefined;

    if (this.customConfigFile) {
      new SampleFile(this, this.customConfigFile, {
        sourcePath: join(import.meta.dirname, 'sample/mw.config.js'),
      });
    }

    const mwPrettier = new MwPrettier(this, prettier);

    const mwEslint = new MwEslint(this, {
      ...eslint,
      ignores: [mwPrettier.filePath, ...eslintIgnores],
    });

    if (license !== '_skip_') {
      new License(this, license);
    }

    if (mise) {
      new MwMiseConfig(this, mise);
    }

    const vsc = new vscode.VsCode(this);
    vsc.settings.addSettings({
      'typescript.tsdk': 'node_modules/typescript/lib',
      ...vscSettings,
    });

    if (!tsExcludeGenFiles) {
      if (this.customConfigFile) {
        tsInclude.unshift(this.customConfigFile);
      }
      tsInclude.unshift(
        genFilePath('.projenrc.js'),
        mwEslint.filePath,
        mwPrettier.filePath,
      );
    }

    new MwTsConfig(this, {
      ...typescript,
      include: tsInclude,
    });
  }

  preSynthesize() {
    // default task in Project doesn't have body
    this.defaultTask?.reset('node .projenrc.js');
  }
}
