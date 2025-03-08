import { genImport } from 'knitwork';

// Docs: https://github.com/unjs/knitwork

// TODO: solve with context-like system
let useMjs = false;

/**
 * @param {string} filePath
 */
export function genFilePath(filePath) {
  return useMjs ? filePath.replace(/\.js$/, '.mjs') : filePath;
}

/**
 * @typedef {Required<Parameters<genImport>>} importParams
 *
 * @param {importParams[0]} specifier Package name or file path without extension
 * @param {importParams[1]} imports String for default export, string[] for named exports
 */
export function genImportString(specifier, imports) {
  return genImport(
    testFilePath(specifier) ? genFilePath(specifier) : specifier,
    imports,
    { singleQuotes: true },
  );
}

/**
 * @param {boolean} setUseMjs
 */
export function setMjs(setUseMjs) {
  useMjs = setUseMjs;
}

/**
 * @param {string} specifier
 */
function testFilePath(specifier) {
  return specifier.match(/^\.\/.+?\.js$/);
}
