import type { RenovatebotOptions } from 'projen';

export type RenovatebotPreset = 'app' | 'package' | undefined;

type OverrideConfig = Record<string, unknown> & { extends?: string[] };

type RenovatebotOptionsTyped = Omit<RenovatebotOptions, 'overrideConfig'> & {
  overrideConfig?: OverrideConfig;
};

const renovateCommonOptions: RenovatebotOptionsTyped = {
  ignoreProjen: false,
  labels: ['dependencies'],
  overrideConfig: {
    commitMessageAction: 'Renovate',
    dependencyDashboard: true,
    extends: ['config:recommended', 'helpers:pinGitHubActionDigests'],
    // unsetting the default ignoreDeps from projen
    ignoreDeps: undefined,
    // override the default packageRules from projen
    // https://github.com/projen/projen/blob/main/src/renovatebot.ts
    packageRules: [
      // https://docs.renovatebot.com/configuration-options/#prevent-holding-broken-npm-packages
      { matchDatasources: ['npm'], minimumReleaseAge: '1 day' },
    ],
    postUpdateOptions: ['pnpmDedupe'],
    rangeStrategy: 'bump',
    timezone: 'America/Los_Angeles',
  },
};

const renovateAppOptions: RenovatebotOptionsTyped = {
  overrideConfig: {
    extends: [
      ...(renovateCommonOptions.overrideConfig?.extends ?? []),
      'group:allNonMajor',
    ],
    lockFileMaintenance: { enabled: false },
  },
  scheduleInterval: ['before 6:00am on Friday every 4 weeks'],
};

const renovatePackageOptions: RenovatebotOptionsTyped = {
  overrideConfig: {
    patch: { automerge: true },
    rebaseWhen: 'behind-base-branch',
  },
};

export function getRenovatebotOptions(
  preset: RenovatebotPreset,
  renovateCustomOptions: RenovatebotOptions,
): RenovatebotOptions {
  const renovatePresetOptions =
    preset === 'app' ? renovateAppOptions : renovatePackageOptions;

  return {
    ...renovateCommonOptions,
    ...renovatePresetOptions,
    ...renovateCustomOptions,
    overrideConfig: {
      ...renovateCommonOptions.overrideConfig,
      ...renovatePresetOptions.overrideConfig,
      ...(renovateCustomOptions.overrideConfig as OverrideConfig | undefined),
    },
  };
}
