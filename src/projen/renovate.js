/** @import { RenovatebotOptions } from 'projen' */

/** @type {RenovatebotOptions} */
const renovateCommonOptions = {
  ignoreProjen: false,
  labels: ['dependencies'],
  overrideConfig: {
    commitMessageAction: 'Renovate',
    dependencyDashboard: true,
    extends: ['config:recommended', 'helpers:pinGitHubActionDigests'],
    // unsetting the default ignoreDeps from projen
    ignoreDeps: undefined,
    // unsetting the default packageRules from projen
    packageRules: undefined,
    postUpdateOptions: ['pnpmDedupe'],
    rangeStrategy: 'bump',
    timezone: 'America/Los_Angeles',
  },
};

/** @type {RenovatebotOptions} */
const renovateAppOptions = {
  overrideConfig: {
    extends: [
      ...renovateCommonOptions.overrideConfig.extends,
      'group:allNonMajor',
    ],
    lockFileMaintenance: {
      enabled: false,
    },
  },
  scheduleInterval: ['before 6:00am on Friday every 4 weeks'],
};

/** @type {RenovatebotOptions} */
const renovatePackageOptions = {
  overrideConfig: {
    patch: {
      automerge: true,
    },
    rebaseWhen: 'behind-base-branch',
  },
};

/**
 * @typedef {'app' | 'package' | undefined} RenovatebotPreset
 *
 * @param {RenovatebotPreset} preset
 * @param {RenovatebotOptions} renovateCustomOptions
 * @returns {RenovatebotOptions}
 */
export function getRenovatebotOptions(preset, renovateCustomOptions) {
  const renovatePresetOptions =
    preset === 'app' ? renovateAppOptions : renovatePackageOptions;

  return {
    ...renovateCommonOptions,
    ...renovatePresetOptions,
    ...renovateCustomOptions,
    overrideConfig: {
      ...renovateCommonOptions.overrideConfig,
      ...renovatePresetOptions.overrideConfig,
      ...renovateCustomOptions.overrideConfig,
    },
  };
}
