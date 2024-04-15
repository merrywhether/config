import { MwJsConfigFile } from './js-config.js';

/**
 * @typedef {Object} MwEslintState
 * @prop {'base' | 'typescript' | 'react' | 'solid'} preset
 * @prop {string[]} [ignores]
 *
 * @typedef {MwEslintState & Omit<import("./js-config.js").MwJsConfigFileOpts, 'type' | 'preset'>} MwEslintOpts
 */

/** @implements {Required<Omit<MwEslintState, 'preset'>>} */
export class MwEslint extends MwJsConfigFile {
  /**
   * @constructor
   * @param {import("projen").Project} project
   * @param {MwEslintOpts} opts
   */
  constructor(project, { ignores = [], ...opts }) {
    super(project, { ...opts, type: 'eslint' });
    this.ignores = ignores;
    this.ignores.unshift('.cache/**', this.filePath);
  }

  /** @override */
  renderExportHead() {
    this.line(`{`);
    this.open();
    this.line(`ignores: [`);
    this.open();
    this.ignores.forEach((ignore) => {
      this.line(`'${ignore}',`);
    });
    this.close();
    this.line(`],`);
    this.close();
    this.line(`},`);
  }
}
