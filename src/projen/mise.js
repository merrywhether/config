/** @import { Project } from 'projen' */

import { TomlFile } from 'projen';

import { getNodeTarget } from './util/index.js';

/**
 * @typedef {Object} MwMiseConfigOpts
 * @prop {string} version
 * @prop {boolean} [autodetect=true]
 */

export class MwMiseConfig extends TomlFile {
  /**
   * @constructor
   * @param {Project} project
   * @param {MwMiseConfigOpts} opts
   */
  constructor(project, { autodetect = true, version }) {
    super(project, '.mise.toml', {
      committed: true,
      obj: { tools: { node: autodetect ? getNodeTarget(version) : version } },
    });
  }
}
