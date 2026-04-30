import { javascript, type Project } from 'projen';

export type MwTsConfigOpts = MwTsConfigState
  & Omit<javascript.TypescriptConfigOptions, 'extends'>;

export interface MwTsConfigState {
  extends?: string | string[];
  /** _skip_ prevents adding default extensions */
  presets?: '_skip_'[] | ('base' | 'solid' | 'styled' | 'vue')[];
}

export class MwTsConfig extends javascript.TypescriptConfig {
  constructor(
    project: Project,
    { extends: _extends = [], presets = ['base'], ...opts }: MwTsConfigOpts,
  ) {
    const extendsArr = Array.isArray(_extends) ? _extends : [_extends];
    if (!(presets as string[]).includes('_skip_')) {
      for (const preset of [...presets].reverse()) {
        extendsArr.unshift(`@merrywhether/config/ts-${preset}`);
      }
    }

    super(project, {
      ...opts,
      extends: javascript.TypescriptConfigExtends.fromPaths(extendsArr),
    });
  }
}
