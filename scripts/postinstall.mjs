import { constants, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const sourcePath = join(
  fileURLToPath(dirname(import.meta.resolve('@merrywhether/config'))),
  'sample/.projenrc.js',
);

const extension = process.env.npm_package_type === 'module' ? 'js' : 'mjs';

const targetPath = join(
  process.env.INIT_CWD ?? cwd(),
  `.projenrc.${extension}`,
);

try {
  copyFileSync(sourcePath, targetPath, constants.COPYFILE_EXCL);
  console.log(
    `@merrywhether/config ready for package type ${process.env.npm_package_type}!\nConsider adding '"pj": "node .projenrc.${extension}"' to package.json.\n`,
  );
} catch (e) {
  if (e instanceof Error && 'code' in e && e.code === 'EEXIST') {
    console.info('@merrywhether/config projen already exists.\n');
  } else {
    throw e;
  }
}
