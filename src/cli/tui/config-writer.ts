import { writeFileSync } from 'node:fs';

import type { MwConfig, MwProjectConfig } from '../../types.ts';

export function writeConfigFile(
  filepath: string,
  config: MwProjectConfig,
  existingFullConfig: MwConfig | null,
): void {
  const projectSection = buildProjectSection(config);

  const topLevel: Record<string, unknown> = { project: projectSection };

  // Preserve hand-edited top-level keys from the existing config
  if (existingFullConfig) {
    if (existingFullConfig.eslint !== undefined)
      topLevel.eslint = existingFullConfig.eslint;
    if (existingFullConfig.prettier !== undefined)
      topLevel.prettier = existingFullConfig.prettier;
    if (
      existingFullConfig.ignorePatternsList !== undefined
      && existingFullConfig.ignorePatternsList.length > 0
    )
      topLevel.ignorePatternsList = existingFullConfig.ignorePatternsList;
    if (existingFullConfig.pnpm !== undefined)
      topLevel.pnpm = existingFullConfig.pnpm;
    if (existingFullConfig.preset !== undefined)
      topLevel.preset = existingFullConfig.preset;
  }

  const content = `import { defineConfig } from '@merrywhether/config';\n\nexport default defineConfig(${stringify(topLevel)});\n`;

  writeFileSync(filepath, content, 'utf-8');
}

function buildProjectSection(
  project: MwProjectConfig,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (project.copyright !== undefined) out.copyright = project.copyright;

  if (project.depManagement !== undefined) {
    const dm: Record<string, unknown> = { tool: project.depManagement.tool };
    if (project.depManagement.preset !== undefined)
      dm.preset = project.depManagement.preset;
    out.depManagement = dm;
  }

  if (project.formatting !== undefined) {
    const fmt: Record<string, unknown> = { tool: project.formatting.tool };
    if (project.formatting.customConfig)
      fmt.customConfig = project.formatting.customConfig;
    out.formatting = fmt;
  }

  if (project.ignorePatterns) out.ignorePatterns = true;

  if (project.license !== undefined) out.license = project.license;

  if (project.linting !== undefined) {
    const lint: Record<string, unknown> = { tool: project.linting.tool };
    if (
      project.linting.presets !== undefined
      && project.linting.presets.length > 0
    )
      lint.presets = project.linting.presets;
    if (project.linting.customConfig) lint.customConfig = true;
    if (project.linting.extraIgnores) lint.extraIgnores = true;
    out.linting = lint;
  }

  if (project.mise !== undefined) out.mise = project.mise;

  if (project.typecheck !== undefined) {
    const tc: Record<string, unknown> = { tool: project.typecheck.tool };
    if (
      project.typecheck.presets !== undefined
      && project.typecheck.presets.length > 0
    )
      tc.presets = project.typecheck.presets;
    if (project.typecheck.include !== undefined)
      tc.include = project.typecheck.include;
    out.typecheck = tc;
  }

  return out;
}

function stringify(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);

  if (value === null) return 'null';
  if (value === false) return 'false';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${pad1}${stringify(v, indent + 1)}`);
    return `[\n${items.join(',\n')},\n${pad}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined,
    );
    if (entries.length === 0) return '{}';
    const items = entries.map(
      ([k, v]) => `${pad1}${k}: ${stringify(v, indent + 1)}`,
    );
    return `{\n${items.join(',\n')},\n${pad}}`;
  }

  return JSON.stringify(value);
}
