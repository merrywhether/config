import type { MwConfig } from '@merrywhether/config';

import { lilconfig } from 'lilconfig';

export interface ConfigResult {
  config: MwConfig;
  filepath: string;
}

export async function loadConfig(cwd: string): Promise<ConfigResult | null> {
  const explorer = lilconfig('mw', {
    loaders: { '.mts': tsLoader, '.ts': tsLoader },
    searchPlaces: [
      'mw.config.ts',
      'mw.config.mts',
      'mw.config.js',
      'mw.config.mjs',
      '.mwrc.json',
      'package.json',
    ],
  });

  const result = await explorer.search(cwd);
  if (!result) return null;
  return { config: result.config as MwConfig, filepath: result.filepath };
}

async function tsLoader(filepath: string): Promise<MwConfig> {
  const mod = (await import(filepath)) as { default: MwConfig };
  return mod.default;
}
