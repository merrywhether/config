import type { MwPreset, MwPresetMetadata, MwToolDef } from './types.ts';

export interface ValidatePresetResult {
  errors: string[];
  pass: boolean;
}

export function validatePreset(preset: MwPreset): ValidatePresetResult {
  const errors: string[] = [];
  const { metadata } = preset;

  // Validate each category
  for (const [categoryName, category] of Object.entries(
    metadata as Record<string, MwPresetMetadata[keyof MwPresetMetadata]>,
  )) {
    if (!category) continue;

    for (const [toolName, tool] of Object.entries(
      category.tools as Record<string, MwToolDef | undefined>,
    )) {
      if (!tool) continue;

      // Validate selectionMode matches default type
      if (tool.selectionMode === 'single' && Array.isArray(tool.default)) {
        errors.push(
          `${categoryName}.${toolName}: selectionMode is 'single' but default is an array`,
        );
      }
      if (tool.selectionMode === 'multi' && !Array.isArray(tool.default)) {
        errors.push(
          `${categoryName}.${toolName}: selectionMode is 'multi' but default is not an array`,
        );
      }

      // Validate default references valid preset keys
      const defaults =
        Array.isArray(tool.default) ? tool.default : [tool.default];
      for (const d of defaults) {
        if (!(d in tool.presets)) {
          errors.push(
            `${categoryName}.${toolName}: default "${d}" is not a key in presets`,
          );
        }
      }

      // Validate presets have required fields
      for (const [presetName, presetDef] of Object.entries(tool.presets)) {
        if (!presetDef.label) {
          errors.push(
            `${categoryName}.${toolName}.presets.${presetName}: missing label`,
          );
        }
        if (!presetDef.description) {
          errors.push(
            `${categoryName}.${toolName}.presets.${presetName}: missing description`,
          );
        }
      }
    }
  }

  return { errors, pass: errors.length === 0 };
}
