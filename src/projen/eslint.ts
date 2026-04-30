import type { Project } from 'projen';

import { MwJsConfigFile, type MwJsConfigFileOpts } from './js-config.ts';

export type MwEslintOpts = MwEslintState
  & Omit<MwJsConfigFileOpts, 'preset' | 'type'>;

interface MwEslintState {
  ignores?: string[];
  presets?: string[];
}

/** Priority order for eslint preset resolution (highest index wins). */
const PRESET_PRIORITY = [
  'base',
  'typescript',
  'vue',
  'solid',
  'react',
] as const;

export class MwEslint
  extends MwJsConfigFile
  implements Required<Omit<MwEslintState, 'presets'>>
{
  ignores: string[];

  constructor(
    project: Project,
    { ignores = [], presets = ['typescript'], ...opts }: MwEslintOpts,
  ) {
    super(project, { ...opts, preset: resolvePreset(presets), type: 'eslint' });
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

function resolvePreset(presets: string[]): string {
  let resolved = 'base';
  for (const candidate of PRESET_PRIORITY) {
    if (presets.includes(candidate)) {
      resolved = candidate;
    }
  }
  return resolved;
}
