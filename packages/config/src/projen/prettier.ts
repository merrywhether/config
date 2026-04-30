import type { Project } from 'projen';

import { MwJsConfigFile, type MwJsConfigFileOpts } from './js-config.ts';

export type MwPrettierOpts = Omit<MwJsConfigFileOpts, 'preset' | 'type'>;

export class MwPrettier extends MwJsConfigFile {
  constructor(project: Project, opts: MwPrettierOpts) {
    super(project, { ...opts, type: 'prettier' });
  }
}
