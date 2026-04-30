import { javascript, type Project } from 'projen';

export type MwTsConfigOpts = MwTsConfigState
  & Omit<javascript.TypescriptConfigOptions, 'extends'>;

export interface MwTsConfigState {
  extends?: string | string[];
  /** _skip_ prevents adding default extension */
  preset?: '_skip_' | 'base' | 'solid' | 'styled';
}

export class MwTsConfig extends javascript.TypescriptConfig {
  constructor(
    project: Project,
    { extends: _extends = [], preset = 'base', ...opts }: MwTsConfigOpts,
  ) {
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
