import { genImport } from 'knitwork';

import { detectPackageType } from './package-type.ts';

// Docs: https://github.com/unjs/knitwork

// TODO: solve with context-like system
let useMjs = false;

type ImportParams = Required<Parameters<typeof genImport>>;

export function genFilePath(filePath: string): string {
  return useMjs ? filePath.replace(/\.js$/, '.mjs') : filePath;
}

/**
 * @param specifier Package name or file path without extension
 * @param imports String for default export, string[] for named exports
 */
export function genImportString(
  specifier: ImportParams[0],
  imports: ImportParams[1],
): string {
  return genImport(
    testFilePath(specifier) ? genFilePath(specifier) : specifier,
    imports,
    { singleQuotes: true },
  );
}

export function setMjs(override?: boolean): void {
  useMjs = override ?? detectPackageType() !== 'module';
}

function testFilePath(specifier: string): null | RegExpMatchArray {
  return /^\.\/.+?\.js$/.exec(specifier);
}
