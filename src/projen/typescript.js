import { javascript } from 'projen';
/** @import { Project } from 'projen' */

/**
 * @typedef {Object} MwTsConfigState
 * @prop {string | string[]} [extends]
 * @prop {'base' | 'solid' | 'styled' | '_skip_'} [preset="base"] _skip_ prevents adding default extension
 *
 * @typedef {MwTsConfigState & Omit<javascript.TypescriptConfigOptions, 'extends'>} MwTsConfigOpts
 */

export class MwTsConfig extends javascript.TypescriptConfig {
  /**
   * @constructor
   * @param {Project} project
   * @param {MwTsConfigOpts} opts
   */
  constructor(project, { extends: _extends = [], preset = 'base', ...opts }) {
    const extendsArr = Array.isArray(_extends) ? _extends : [_extends];
    if (preset !== '_skip_') {
      extendsArr.unshift(`@merrywhether/config/ts-${preset}`);
    }

    super(project, {
      ...opts,
      extends: javascript.TypescriptConfigExtends.fromPaths(extendsArr),
    });
  }
}
