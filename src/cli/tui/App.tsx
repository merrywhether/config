import { Box, Text, useApp, useInput } from 'ink';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import React, { useState } from 'react';

import type {
  DepManagementTool,
  FormattingTool,
  LintingTool,
  MwConfig,
  MwPreset,
  MwProjectConfig,
  TypecheckTool,
} from '../../types.ts';

import { updateAgentsMd } from '../agents-md.ts';
import { detectPackageManager, getSynthCommand } from '../pkg-manager.ts';
import { writeConfigFile } from './config-writer.ts';

export interface AppProps {
  configFilepath: string;
  cwd: string;
  existingFullConfig: MwConfig | null;
  initialConfig: MwProjectConfig;
  preset: MwPreset;
  version: string;
}

type InkColor =
  | 'blue'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'magenta'
  | 'red'
  | 'white'
  | 'yellow';

// A focusable row in the TUI
interface Row {
  activate: (config: MwProjectConfig) => MwProjectConfig;
  hidden: (config: MwProjectConfig) => boolean;
  label: string;
  render: (config: MwProjectConfig, focused: boolean) => React.ReactElement;
}

export function App({
  configFilepath,
  cwd,
  existingFullConfig,
  initialConfig,
  preset,
  version,
}: AppProps): React.ReactElement {
  const [config, setConfig] = useState<MwProjectConfig>(initialConfig);
  const [focusIndex, setFocusIndex] = useState(0);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [presetSubFocus, setPresetSubFocus] = useState(0);
  const { exit } = useApp();

  const lintingTools = Object.keys(preset.metadata.linting?.tools ?? {});
  const eslintPresets = Object.keys(
    preset.metadata.linting?.tools.eslint?.presets ?? {},
  );
  const formattingTools = Object.keys(preset.metadata.formatting?.tools ?? {});
  const depManTools = Object.keys(preset.metadata.depManagement?.tools ?? {});
  const renovatePresets = Object.keys(
    preset.metadata.depManagement?.tools.renovate?.presets ?? {},
  );
  const typecheckTools = Object.keys(preset.metadata.typecheck?.tools ?? {});
  const tsPresets = Object.keys(
    preset.metadata.typecheck?.tools.typescript?.presets ?? {},
  );

  const allRows: Row[] = [
    // Row 0: Linting tool
    {
      activate: (cfg) => ({
        ...cfg,
        linting: {
          ...cfg.linting,
          tool: cycleRadio(
            lintingTools,
            cfg.linting?.tool ?? null,
          ) as LintingTool | null,
        },
      }),
      hidden: () => false,
      label: 'Linting / Tool',
      render: (cfg, focused) =>
        radioWithNone(lintingTools, cfg.linting?.tool ?? null, focused),
    },
    // Row 1: ESLint presets
    {
      activate: (cfg): MwProjectConfig => {
        const current = cfg.linting?.presets ?? [];
        const nextPreset = eslintPresets.find((p) => !current.includes(p));
        const newPresets =
          nextPreset != null ? [...current, nextPreset] : current.slice(0, -1);
        return {
          ...cfg,
          linting: {
            ...cfg.linting,
            presets: newPresets,
            tool: cfg.linting?.tool ?? null,
          },
        };
      },
      hidden: (cfg) => cfg.linting?.tool !== 'eslint',
      label: 'Linting / ESLint presets',
      render: (cfg, focused) =>
        checkboxes(eslintPresets, cfg.linting?.presets ?? [], focused),
    },
    // Row 2: Linting custom config
    {
      activate: (cfg) => ({
        ...cfg,
        linting: {
          ...cfg.linting,
          customConfig: !(cfg.linting?.customConfig ?? false),
          tool: cfg.linting?.tool ?? null,
        },
      }),
      hidden: () => false,
      label: 'Linting / Custom config',
      render: (cfg, focused) =>
        boolToggle(cfg.linting?.customConfig ?? false, focused),
    },
    // Row 3: Linting extra ignores
    {
      activate: (cfg) => ({
        ...cfg,
        linting: {
          ...cfg.linting,
          extraIgnores: !(cfg.linting?.extraIgnores ?? false),
          tool: cfg.linting?.tool ?? null,
        },
      }),
      hidden: () => false,
      label: 'Linting / Extra ignores',
      render: (cfg, focused) =>
        boolToggle(cfg.linting?.extraIgnores ?? false, focused),
    },
    // Row 4: Formatting tool
    {
      activate: (cfg) => ({
        ...cfg,
        formatting: {
          ...cfg.formatting,
          tool: cycleRadio(
            formattingTools,
            cfg.formatting?.tool ?? null,
          ) as FormattingTool | null,
        },
      }),
      hidden: () => false,
      label: 'Formatting / Tool',
      render: (cfg, focused) =>
        radioWithNone(formattingTools, cfg.formatting?.tool ?? null, focused),
    },
    // Row 5: Formatting custom config
    {
      activate: (cfg) => ({
        ...cfg,
        formatting: {
          ...cfg.formatting,
          customConfig: !(cfg.formatting?.customConfig ?? false),
          tool: cfg.formatting?.tool ?? null,
        },
      }),
      hidden: () => false,
      label: 'Formatting / Custom config',
      render: (cfg, focused) =>
        boolToggle(cfg.formatting?.customConfig ?? false, focused),
    },
    // Row 6: Dep management tool
    {
      activate: (cfg) => ({
        ...cfg,
        depManagement: {
          ...cfg.depManagement,
          tool: cycleRadio(
            depManTools,
            cfg.depManagement?.tool ?? null,
          ) as DepManagementTool | null,
        },
      }),
      hidden: () => false,
      label: 'Dep management / Tool',
      render: (cfg, focused) =>
        radioWithNone(depManTools, cfg.depManagement?.tool ?? null, focused),
    },
    // Row 7: Renovate preset
    {
      activate: (cfg) => ({
        ...cfg,
        depManagement: {
          ...cfg.depManagement,
          preset:
            cycleRadio(renovatePresets, cfg.depManagement?.preset ?? null)
            ?? renovatePresets[0],
          tool: cfg.depManagement?.tool ?? null,
        },
      }),
      hidden: (cfg) => cfg.depManagement?.tool !== 'renovate',
      label: 'Dep management / Renovate preset',
      render: (cfg, focused) =>
        radioWithNone(
          renovatePresets,
          cfg.depManagement?.preset ?? null,
          focused,
        ),
    },
    // Row 8: Typecheck tool
    {
      activate: (cfg) => ({
        ...cfg,
        typecheck: {
          ...cfg.typecheck,
          tool: cycleRadio(
            typecheckTools,
            cfg.typecheck?.tool ?? null,
          ) as null | TypecheckTool,
        },
      }),
      hidden: () => false,
      label: 'Typecheck / Tool',
      render: (cfg, focused) =>
        radioWithNone(typecheckTools, cfg.typecheck?.tool ?? null, focused),
    },
    // Row 9: TS presets
    {
      activate: (cfg): MwProjectConfig => {
        const current = cfg.typecheck?.presets ?? [];
        const nextPreset = tsPresets.find((p) => !current.includes(p));
        const newPresets =
          nextPreset != null ? [...current, nextPreset] : current.slice(0, -1);
        return {
          ...cfg,
          typecheck: {
            ...cfg.typecheck,
            presets: newPresets,
            tool: cfg.typecheck?.tool ?? null,
          },
        };
      },
      hidden: (cfg) => cfg.typecheck?.tool !== 'typescript',
      label: 'Typecheck / TS presets',
      render: (cfg, focused) =>
        checkboxes(tsPresets, cfg.typecheck?.presets ?? [], focused),
    },
    // Row 10: License (read-only)
    {
      activate: (cfg) => cfg,
      hidden: () => false,
      label: 'Project / License',
      render: (cfg, focused) => (
        <Box flexDirection="row">
          <Text color={focused ? 'cyan' : 'gray'}>
            {String(cfg.license ?? 'MIT')}{' '}
          </Text>
          <Text dimColor>(edit mw.config.ts)</Text>
        </Box>
      ),
    },
    // Row 11: Copyright (read-only)
    {
      activate: (cfg) => cfg,
      hidden: () => false,
      label: 'Project / Copyright',
      render: (cfg, focused) => (
        <Box flexDirection="row">
          <Text color={focused ? 'cyan' : 'gray'}>{cfg.copyright ?? ''} </Text>
          <Text dimColor>(edit mw.config.ts)</Text>
        </Box>
      ),
    },
    // Row 12: Mise (read-only)
    {
      activate: (cfg) => cfg,
      hidden: () => false,
      label: 'Project / Mise',
      render: (cfg, focused) => (
        <Box flexDirection="row">
          <Text color={focused ? 'cyan' : 'gray'}>
            {cfg.mise === false ? 'disabled' : (cfg.mise ?? 'lts')}{' '}
          </Text>
          <Text dimColor>(edit mw.config.ts)</Text>
        </Box>
      ),
    },
    // Row 13: Ignore patterns toggle
    {
      activate: (cfg) => ({
        ...cfg,
        ignorePatterns: !(cfg.ignorePatterns ?? false),
      }),
      hidden: () => false,
      label: 'Project / Ignore patterns',
      render: (cfg, focused) =>
        boolToggle(cfg.ignorePatterns ?? false, focused),
    },
    // Row 14: Agent instructions toggle
    {
      activate: (cfg) => cfg, // handled in handleToggle
      hidden: () => false,
      label: 'Advanced / Agent instructions (AGENTS.md)',
      render: (_cfg, focused): React.ReactElement => {
        const agentsMdPath = join(cwd, 'AGENTS.md');
        const hasAgentsMd = existsSync(agentsMdPath);
        return boolToggle(hasAgentsMd, focused);
      },
    },
  ];

  const visibleRows = allRows.filter((row) => !row.hidden(config));
  const maxFocus = visibleRows.length - 1;

  function handleToggle(): void {
    const visibleRow = visibleRows[focusIndex];

    const rowIdx = allRows.indexOf(visibleRow);

    // Special handling for AGENTS.md toggle (row 14)
    if (rowIdx === 14) {
      const agentsMdPath = join(cwd, 'AGENTS.md');
      if (existsSync(agentsMdPath)) {
        const content = readFileSync(agentsMdPath, 'utf-8');
        const updated = content
          .replace(
            /<!-- mw-config:start -->[\s\S]*?<!-- mw-config:end -->\n?/g,
            '',
          )
          .trimEnd();
        writeFileSync(
          agentsMdPath,
          updated.length > 0 ? `${updated}\n` : '',
          'utf-8',
        );
      } else {
        const updated = updateAgentsMd('');
        writeFileSync(agentsMdPath, updated, 'utf-8');
      }
      setSaved(false);
      return;
    }

    const newConfig = visibleRow.activate(config);
    setConfig(newConfig);
    setSaved(false);
  }

  function handleSave(): void {
    try {
      writeConfigFile(configFilepath, config, existingFullConfig);
      const pm = detectPackageManager(cwd);
      const cmd = getSynthCommand(pm);
      execSync(cmd, { cwd, stdio: 'inherit' });
      setSaved(true);
      setStatusMessage('Saved & synthesized!');
      setTimeout(() => {
        setStatusMessage('');
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Error: ${msg}`);
    }
  }

  useInput((input, key) => {
    if (input === 'q') {
      exit();
      return;
    }
    if (input === 's') {
      handleSave();
      return;
    }
    if (key.upArrow) {
      setFocusIndex((f) => Math.max(0, f - 1));
      setPresetSubFocus(0);
      return;
    }
    if (key.downArrow) {
      setFocusIndex((f) => Math.min(maxFocus, f + 1));
      setPresetSubFocus(0);
      return;
    }

    // Left/right for preset checkboxes
    const visibleRow = visibleRows[focusIndex];
    const rowIdx = allRows.indexOf(visibleRow);
    const isPresetRow = rowIdx === 1 || rowIdx === 9;

    if (isPresetRow) {
      const presets = rowIdx === 1 ? eslintPresets : tsPresets;
      const currentPresets =
        rowIdx === 1 ?
          (config.linting?.presets ?? [])
        : (config.typecheck?.presets ?? []);

      if (key.leftArrow) {
        setPresetSubFocus((f) => Math.max(0, f - 1));
        return;
      }
      if (key.rightArrow) {
        setPresetSubFocus((f) => Math.min(presets.length - 1, f + 1));
        return;
      }
      if (input === ' ' || key.return) {
        const targetPreset = presets[presetSubFocus];
        const newPresets = togglePreset(currentPresets, targetPreset);
        if (rowIdx === 1) {
          setConfig((c) => ({
            ...c,
            linting: {
              ...c.linting,
              presets: newPresets,
              tool: c.linting?.tool ?? null,
            },
          }));
        } else {
          setConfig((c) => ({
            ...c,
            typecheck: {
              ...c.typecheck,
              presets: newPresets,
              tool: c.typecheck?.tool ?? null,
            },
          }));
        }
        setSaved(false);
        return;
      }
    }

    if (input === ' ' || key.return) {
      handleToggle();
    }
  });

  function renderPresetRow(
    presets: string[],
    selected: string[],
    focused: boolean,
  ): React.ReactElement {
    return (
      <Box flexDirection="row" gap={2}>
        {presets.map((opt, i) => (
          <Box flexDirection="row" key={opt}>
            {focused && i === presetSubFocus ?
              <Text color="yellow">
                {selected.includes(opt) ? '[✓]' : '[ ]'}
              </Text>
            : <FocusText focused={focused}>
                {selected.includes(opt) ? '[✓]' : '[ ]'}
              </FocusText>
            }
            <Text> {opt}</Text>
          </Box>
        ))}
      </Box>
    );
  }

  type SectionName =
    | 'Advanced'
    | 'Dep management'
    | 'Formatting'
    | 'Linting'
    | 'Project'
    | 'Typecheck';

  const sectionOrder: SectionName[] = [
    'Linting',
    'Formatting',
    'Dep management',
    'Typecheck',
    'Project',
    'Advanced',
  ];

  const sections: Record<
    SectionName,
    { rows: { content: React.ReactElement; label: string }[] }
  > = {
    Advanced: { rows: [] },
    'Dep management': { rows: [] },
    Formatting: { rows: [] },
    Linting: { rows: [] },
    Project: { rows: [] },
    Typecheck: { rows: [] },
  };

  visibleRows.forEach((row, vIdx) => {
    const focused = vIdx === focusIndex;
    const rowIdx = allRows.indexOf(row);
    const sectionName: SectionName =
      rowIdx <= 3 ? 'Linting'
      : rowIdx <= 5 ? 'Formatting'
      : rowIdx <= 7 ? 'Dep management'
      : rowIdx <= 9 ? 'Typecheck'
      : rowIdx <= 13 ? 'Project'
      : 'Advanced';

    const section = sections[sectionName];

    let content: React.ReactElement;

    if (rowIdx === 1 && focused) {
      content = renderPresetRow(
        eslintPresets,
        config.linting?.presets ?? [],
        true,
      );
    } else if (rowIdx === 9 && focused) {
      content = renderPresetRow(
        tsPresets,
        config.typecheck?.presets ?? [],
        true,
      );
    } else {
      content = row.render(config, focused);
    }

    const shortLabel = row.label.split(' / ')[1] ?? row.label;
    section.rows.push({ content, label: shortLabel });
  });

  const labelWidth = 22;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Text bold color="blue">
          @merrywhether/config
        </Text>
        <Box flexDirection="row">
          <Text color="gray">v{version}</Text>
          {!saved && <Text color="yellow"> *</Text>}
        </Box>
      </Box>

      {/* Sections */}
      {sectionOrder.map((sectionName) => {
        const { rows } = sections[sectionName];
        if (rows.length === 0) return null;
        return (
          <Box flexDirection="column" key={sectionName} marginBottom={1}>
            <Text bold underline>
              {sectionName}
            </Text>
            {rows.map(({ content, label }) => (
              <Box flexDirection="row" key={label} paddingLeft={2}>
                <Box width={labelWidth}>
                  <Text color="gray">{label}</Text>
                </Box>
                {content}
              </Box>
            ))}
          </Box>
        );
      })}

      {/* Divider */}
      <Text color="gray">{'─'.repeat(60)}</Text>

      {/* Footer */}
      <Box flexDirection="row" gap={3} marginTop={1}>
        <Text>
          <Text bold color="cyan">
            [s]
          </Text>{' '}
          Save & synth
        </Text>
        <Text>
          <Text bold color="cyan">
            [q]
          </Text>{' '}
          Quit
        </Text>
        <Text color="gray">↑↓ navigate ←→ preset space/enter toggle</Text>
      </Box>

      {statusMessage.length > 0 && (
        <Text color={statusMessage.startsWith('Error') ? 'red' : 'green'}>
          {statusMessage}
        </Text>
      )}
    </Box>
  );
}

function boolToggle(value: boolean, focused: boolean): React.ReactElement {
  return <FocusText focused={focused}>{value ? '[✓]' : '[ ]'}</FocusText>;
}

function checkboxes(
  options: string[],
  selected: string[],
  focused: boolean,
): React.ReactElement {
  return (
    <Box flexDirection="row" gap={2}>
      {options.map((opt) => (
        <Box flexDirection="row" key={opt}>
          <FocusText focused={focused}>
            {selected.includes(opt) ? '[✓]' : '[ ]'}
          </FocusText>
          <Text> {opt}</Text>
        </Box>
      ))}
    </Box>
  );
}

function cycleRadio<K extends string>(
  options: K[],
  current: K | null,
): K | null {
  if (current === null) return options[0] ?? null;
  const idx = options.indexOf(current);
  if (idx === -1 || idx === options.length - 1) return null;
  return options[idx + 1] ?? null;
}

// Avoid passing undefined to color prop (exactOptionalPropertyTypes)
function FocusText({
  children,
  focusColor = 'cyan',
  focused,
}: {
  children: string;
  focusColor?: InkColor;
  focused: boolean;
}): React.ReactElement {
  if (focused) {
    return <Text color={focusColor}>{children}</Text>;
  }
  return <Text>{children}</Text>;
}

function radioWithNone<K extends string>(
  options: K[],
  current: K | null,
  focused: boolean,
): React.ReactElement {
  return (
    <Box flexDirection="row" gap={2}>
      {options.map((opt) => (
        <Box flexDirection="row" key={opt}>
          <FocusText focused={focused}>
            {current === opt ? '(•)' : '( )'}
          </FocusText>
          <Text> {opt}</Text>
        </Box>
      ))}
      <Box flexDirection="row">
        <FocusText focused={focused}>
          {current === null ? '(•)' : '( )'}
        </FocusText>
        <Text> none</Text>
      </Box>
    </Box>
  );
}

function togglePreset(presets: string[], preset: string): string[] {
  return presets.includes(preset) ?
      presets.filter((p) => p !== preset)
    : [...presets, preset];
}
