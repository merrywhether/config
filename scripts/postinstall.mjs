import { detectPackageType } from '@merrywhether/config/package-type';
import { constants, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const sourcePath = join(
  fileURLToPath(dirname(import.meta.resolve('@merrywhether/config'))),
  'sample/.projenrc.js',
);

const packageType = detectPackageType();
const extension = packageType === 'module' ? 'js' : 'mjs';
const targetDir = process.env.INIT_CWD ?? cwd();
const targetPath = join(targetDir, `.projenrc.${extension}`);

try {
  copyFileSync(sourcePath, targetPath, constants.COPYFILE_EXCL);
  console.info(
    `@merrywhether/config ready for package type ${packageType}!\nConsider adding '"pj": "node .projenrc.${extension}"' to package.json.\n`,
  );
} catch (e) {
  if (e instanceof Error && 'code' in e && e.code === 'EEXIST') {
    console.info('@merrywhether/config projen already exists.\n');
  } else {
    throw e;
  }
}
