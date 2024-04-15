import { join } from 'node:path';
import { License, Project, SampleFile, TomlFile, vscode } from 'projen';
import { MwEslint } from './eslint.js';
import { MwPrettier } from './prettier.js';
import { getRenovatebotOptions } from './renovate.js';
import { MwTsConfig } from './typescript.js';
import { genFilePath, setMjs } from './util.js';

/**
 * @typedef {Object} MwCustomConfigFile
 * @prop {ReturnType<import("typescript-eslint").config>} eslint
 * @prop {Record<string, unknown>} prettier
 */

/**
 * @typedef {Object} MwProjectTsConfig
 * @prop {boolean} [excludeGenFiles]
 */

/**
 * @typedef {Pick<import('./eslint.js').MwEslintOpts, 'preset'> & Partial<Pick<import('./eslint.js').MwEslintOpts, 'customConfig' | 'ignores' >>} EslintOpts
 *
 * @typedef {Object} MwProjectOpts
 * @prop {EslintOpts} eslint
 * @prop {import('projen').LicenseOptions | '_skip_'} [license]
 * @prop {boolean} [mise=true]
 * @prop {import('./renovate.js').RenovatebotPreset} [renovatebotPreset]
 * @prop {Pick<import('./prettier.js').MwPrettierOpts, 'customConfig'>} [prettier]
 * @prop {MwProjectTsConfig & import('./typescript.js').MwTsConfigOpts} [typescript]
 * @prop {boolean} [useMjs] set to override autodetection
 * @prop {Record<string, unknown>} [vscSettings]
 */

export class MwProject extends Project {
  /**
   * @param {string | undefined} customConfigFile
   */

  /**
   * @constructor
   * @param {MwProjectOpts & Omit<import("projen").ProjectOptions, 'renovatebot'>} opts
   */
  constructor({
    eslint: { ignores: eslintIgnores = [], ...eslint },
    gitIgnoreOptions,
    license = { copyrightOwner: 'Risto Keravuori', spdx: 'MIT' },
    mise = true,
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
          '.env',
          '.cache',
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
      new TomlFile(this, '.mise.toml', {
        committed: true,
        obj: {
          tools: {
            node: '20.12',
          },
        },
      });
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
