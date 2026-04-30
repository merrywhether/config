#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import { cwd } from 'node:process';

import { loadConfig } from './config-loader.ts';
import { runFirstRun } from './first-run.ts';

const optionDefinitions = [
  { name: 'describe', type: Boolean },
  { alias: 'h', name: 'help', type: Boolean },
];

interface CliOptions {
  describe?: boolean;
  help?: boolean;
}

async function main(): Promise<void> {
  const options = commandLineArgs(optionDefinitions, {
    partial: true,
  }) as CliOptions;
  const projectCwd = cwd();

  if (options.help) {
    console.log(
      [
        'Usage: mw-config [options]',
        '',
        'Options:',
        '  --describe    Print the current config as JSON and exit',
        '  -h, --help    Show this help message',
      ].join('\n'),
    );
    return;
  }

  if (options.describe) {
    const result = await loadConfig(projectCwd);
    if (!result) {
      console.error('No mw.config.ts found. Run mw-config to initialize.');
      process.exit(1);
    }
    console.log(JSON.stringify(result.config, null, 2));
    return;
  }

  // Check if this is a first run (no mw.config.ts found)
  const result = await loadConfig(projectCwd);
  if (!result) {
    console.log('No mw.config.ts found — running first-time setup...');
    const firstRunResult = runFirstRun(projectCwd);

    if (firstRunResult.migrations.length > 0) {
      console.log(
        `Migrated: ${firstRunResult.migrations.map((f) => `${f} → ${f}.old`).join(', ')}`,
      );
    }
    console.log('Created mw.config.ts');
    if (firstRunResult.projenrcGenerated) console.log('Created .projenrc.ts');
    if (firstRunResult.agentsMdUpdated) console.log('Updated AGENTS.md');
    console.log(
      '\nEdit mw.config.ts, then run your synth command to apply changes.',
    );
    return;
  }

  // TUI not yet implemented (Phase 4)
  console.log('TUI not yet implemented. Use --describe to inspect config.');
}

main().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(String(err));
  }
  process.exit(1);
});
