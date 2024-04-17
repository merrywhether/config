import { SourceCode } from 'projen';

import { genFilePath, genImportString } from './util.js';

/**
 * @typedef {Object} MwJsConfigFileState
 * @prop {boolean} [customConfig]
 * @prop {string | undefined} [preset]
 * @prop {'eslint' | 'prettier'} type
 *
 * @typedef {MwJsConfigFileState & import("projen").SourceCodeOptions} MwJsConfigFileOpts
 */

/** @implements {Required<MwJsConfigFileState>} */
export class MwJsConfigFile extends SourceCode {
  /**
   * @param {string} filePath
   */

  /**
   * @constructor
   * @param {import("projen").Project} project
   * @param {MwJsConfigFileOpts} opts
   */
  constructor(project, { customConfig = false, preset, type, ...opts }) {
    const filePath = genFilePath(`${type}.config.js`);
    super(project, filePath, opts);
    this.filePath = filePath;
    this.customConfig = customConfig;
    this.preset = preset;
    this.type = type;
  }

  #renderExport() {
    this.line(`export default ${this.type === 'eslint' ? '[' : '{'}`);
    this.open();

    this.renderExportHead();

    this.line(`...config${this.preset ? `.${this.preset}` : ''},`);
    if (this.customConfig) {
      this.line(`...customConfig.${this.type},`);
    }

    this.renderExportTail();

    this.close();
    this.line(`${this.type === 'eslint' ? ']' : '}'};`);
    this.line();
  }

  #renderImports() {
    this.line(`// ${this.marker}`);
    this.line();

    this.line(genImportString(`@merrywhether/config/${this.type}`, 'config'));
    if (this.customConfig) {
      this.line(genImportString('./mw.config.js', 'customConfig'));
    }
    this.line();
  }

  renderBody() {}

  renderExportHead() {}

  renderExportTail() {}

  synthesize() {
    this.#renderImports();

    this.renderBody();

    this.#renderExport();
  }
}
