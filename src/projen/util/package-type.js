import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

/**
 * Detects the package type from environment variables or package.json
 * @returns {string} The package type ('module' or 'commonjs')
 */
export function detectPackageType() {
  // Check environment variables
  let packageType =
    process.env.PNPM_PACKAGE_TYPE ?? process.env.npm_package_type;

  // Read package.json to determine type if not set in env
  if (!packageType) {
    try {
      const targetDir = process.env.INIT_CWD ?? cwd();
      const pkg = JSON.parse(
        readFileSync(join(targetDir, 'package.json'), 'utf-8'),
      );
      packageType = pkg.type;
    } catch {
      // Ignore errors reading package.json
    }
  }

  return packageType ?? 'commonjs';
}
