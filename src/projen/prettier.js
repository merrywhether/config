/**
 * @import { Project } from 'projen'
 * @import { MwJsConfigFileOpts } from './js-config.js'
 */

import { MwJsConfigFile } from './js-config.js';

/** @typedef {Omit<MwJsConfigFileOpts, 'type' | 'preset'>} MwPrettierOpts */

export class MwPrettier extends MwJsConfigFile {
  /**
   * @constructor
   * @param {Project} project
   * @param {MwPrettierOpts} opts
   */
  constructor(project, opts) {
    super(project, { ...opts, type: 'prettier' });
  }
}
