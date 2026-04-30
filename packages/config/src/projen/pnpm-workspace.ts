import { type Project, YamlFile } from 'projen';

export interface MwPnpmWorkspaceOpts {
  onlyBuiltDependencies?: string[];
  packages?: string[];
}

export class MwPnpmWorkspace extends YamlFile {
  constructor(project: Project, opts: MwPnpmWorkspaceOpts = {}) {
    const obj: Record<string, unknown> = { minimumReleaseAge: 1440 };
    if (opts.onlyBuiltDependencies && opts.onlyBuiltDependencies.length > 0) {
      obj.onlyBuiltDependencies = opts.onlyBuiltDependencies;
    }
    if (opts.packages && opts.packages.length > 0) {
      obj.packages = opts.packages;
    }
    super(project, 'pnpm-workspace.yaml', { committed: true, obj });
  }
}
