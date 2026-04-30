import { type Project, YamlFile } from 'projen';

export interface MwPnpmWorkspaceOpts {
  onlyBuiltDependencies?: string[];
}

export class MwPnpmWorkspace extends YamlFile {
  constructor(project: Project, opts: MwPnpmWorkspaceOpts = {}) {
    const obj: Record<string, unknown> = { minimumReleaseAge: 1440 };
    if (opts.onlyBuiltDependencies && opts.onlyBuiltDependencies.length > 0) {
      obj.onlyBuiltDependencies = opts.onlyBuiltDependencies;
    }
    super(project, 'pnpm-workspace.yaml', { committed: true, obj });
  }
}
