import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { coerce } from 'semver';

export function getNodeTarget(fallback = 'lts') {
  const engines = coerce(process.env.npm_package_engines_node);
  if (engines) {
    return engines.version;
  }

  try {
    const nvmrc = coerce(readFileSync(join(cwd(), '.nvmrc'), 'utf-8').trim());
    if (nvmrc) {
      return nvmrc.version;
    }
  } catch {
    // file not found
  }

  try {
    const nodeVersion = coerce(
      readFileSync(join(cwd(), '.node-version'), 'utf-8').trim(),
    );
    if (nodeVersion) {
      return nodeVersion.version;
    }
  } catch {
    // file not found
  }

  return fallback;
}
