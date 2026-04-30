import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

export function detectPackageManager(cwd: string): PackageManager {
  try {
    const raw = readFileSync(join(cwd, 'package.json'), 'utf-8');
    const pkg = JSON.parse(raw) as { packageManager?: string };
    if (pkg.packageManager) {
      if (pkg.packageManager.startsWith('pnpm')) return 'pnpm';
      if (pkg.packageManager.startsWith('yarn')) return 'yarn';
      if (pkg.packageManager.startsWith('bun')) return 'bun';
      if (pkg.packageManager.startsWith('npm')) return 'npm';
    }
  } catch {
    // no package.json or unreadable
  }

  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

export function getSynthCommand(pm: PackageManager): string {
  switch (pm) {
    case 'bun':
      return 'bun run pj';
    case 'npm':
      return 'npm run pj';
    case 'pnpm':
      return 'pnpm pj';
    case 'yarn':
      return 'yarn pj';
  }
}
