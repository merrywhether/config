import { type Project, TomlFile } from 'projen';

import { getNodeTarget } from './util/index.ts';

export interface MwMiseConfigOpts {
  autodetect?: boolean;
  version: string;
}

export class MwMiseConfig extends TomlFile {
  constructor(
    project: Project,
    { autodetect = true, version }: MwMiseConfigOpts,
  ) {
    super(project, '.mise.toml', {
      committed: true,
      obj: { tools: { node: autodetect ? getNodeTarget(version) : version } },
    });
  }
}
