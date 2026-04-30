import type { Project } from 'projen';

import { MwJsConfigFile, type MwJsConfigFileOpts } from './js-config.ts';

export type MwEslintOpts = MwEslintState
  & Omit<MwJsConfigFileOpts, 'preset' | 'type'>;

interface MwEslintState {
  ignores?: string[];
  preset: 'base' | 'react' | 'solid' | 'typescript';
}

export class MwEslint
  extends MwJsConfigFile
  implements Required<Omit<MwEslintState, 'preset'>>
{
  ignores: string[];

  constructor(project: Project, { ignores = [], ...opts }: MwEslintOpts) {
    super(project, { ...opts, type: 'eslint' });
    this.ignores = ignores;
    this.ignores.unshift('.cache/**', this.filePath);
  }

  override renderExportHead(): void {
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
