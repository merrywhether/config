import type { javascript } from 'projen';
import type { config as tsEslintConfig } from 'typescript-eslint';

export type DepManagementTool = 'dependabot' | 'renovate';
export type FormattingTool = 'biome' | 'oxfmt' | 'prettier';
// Tool category names (hardcoded because projen requires explicit wiring)
export type LintingTool = 'biome' | 'eslint' | 'oxlint';
export interface MwCategoryDef<TTools extends string> {
  defaultTool: null | TTools;
  tools: Partial<Record<TTools, MwToolDef>>;
}
export interface MwConfig {
  eslint?: {
    config?: ReturnType<typeof tsEslintConfig>;
    extraIgnores?: string[];
  };
  ignorePatternsList?: string[];
  pnpm?: MwPnpmConfig;
  preset?: MwPreset;
  prettier?: { config?: Record<string, unknown> };
  project: MwProjectConfig;
}
export interface MwCustomConfigFile {
  eslint?: ReturnType<typeof tsEslintConfig>;
  prettier?: Record<string, unknown>;
}

export interface MwDepManagementConfig {
  preset?: string;
  tool: DepManagementTool | null;
}

export interface MwFormattingConfig {
  customConfig?: boolean;
  tool: FormattingTool | null;
}

// Config file shapes
export interface MwLintingConfig {
  customConfig?: boolean;
  extraIgnores?: boolean;
  presets?: string[];
  tool: LintingTool | null;
}

export interface MwPnpmConfig {
  onlyBuiltDependencies?: string[];
  packages?: string[];
}

export interface MwPreset {
  metadata: MwPresetMetadata;
}

export interface MwPresetMetadata {
  depManagement?: MwCategoryDef<DepManagementTool>;
  formatting?: MwCategoryDef<FormattingTool>;
  linting?: MwCategoryDef<LintingTool>;
  packageManager?: MwCategoryDef<PackageManagerTool>;
  runtime?: MwCategoryDef<RuntimeTool>;
  typecheck?: MwCategoryDef<TypecheckTool>;
}

export interface MwProjectConfig {
  copyright?: string;
  depManagement?: MwDepManagementConfig;
  formatting?: MwFormattingConfig;
  ignorePatterns?: boolean;
  license?: false | string;
  linting?: MwLintingConfig;
  mise?: false | string;
  runtime?: MwRuntimeConfig;
  typecheck?: MwTypecheckConfig;
}

export interface MwRuntimeConfig {
  tool: null | RuntimeTool;
  version?: string;
}

export interface MwToolDef {
  /** matches selectionMode */
  default: string | string[];
  /** shown in TUI tool radio */
  label: string;
  presets: Record<
    string,
    {
      description: string;
      label: string;
      /** TUI warns if these are missing */
      peerDeps?: string[];
    }
  >;
  /** drives radio vs checkbox for presets */
  selectionMode: 'multi' | 'single';
}

export interface MwTypecheckConfig {
  compilerOptions?: javascript.TypescriptConfigOptions['compilerOptions'];
  include?: string[];
  presets?: string[];
  tool: null | TypecheckTool;
}

export type PackageManagerTool = 'bun' | 'npm' | 'pnpm' | 'yarn';

export type RuntimeTool = 'mise';

export type TypecheckTool = 'typescript';

export function defineConfig(config: MwConfig): MwConfig {
  return config;
}
