import { MwJsConfigFile } from './js-config.js';

/**
 * @typedef {Omit<import("./js-config.js").MwJsConfigFileOpts, 'type' | 'preset'>} MwPrettierOpts
 */

export class MwPrettier extends MwJsConfigFile {
  /**
   * @constructor
   * @param {import("projen").Project} project
   * @param {MwPrettierOpts} opts
   */
  constructor(project, opts) {
    super(project, { ...opts, type: 'prettier' });
  }
}
