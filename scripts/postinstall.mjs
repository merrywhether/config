import { constants, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const sourcePath = join(
  fileURLToPath(dirname(import.meta.resolve('@merrywhether/config'))),
  'sample/.projenrc.js',
);

const targetPath = join(process.env.INIT_CWD ?? cwd(), '.projenrc.js');

try {
  copyFileSync(sourcePath, targetPath, constants.COPYFILE_EXCL);
  console.log(
    '@merrywhether/config ready!\nConsider adding `"pj": "node .projenrc.js"` to package.json.\n',
  );
} catch (e) {
  if (e instanceof Error && 'code' in e && e.code === 'EEXIST') {
    console.info('@merrywhether/config projen already exists.\n');
  } else {
    throw e;
  }
}
