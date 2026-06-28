import { resolve } from 'node:path';

import { buildSkoposTrustRuntime, refreshSkoposMemoryState } from '@skopos/runtime';

import {
  buildSummaryLines,
  parseFieldList,
  projectJsonOutput,
  writeJsonOutput,
  writeLines,
} from '../shared/output.js';

interface ParsedKnowledgeArgs {
  cwd: string;
  actor?: string;
  compact: boolean;
  summary: boolean;
  fields: string[];
  json: boolean;
}

interface SkoposKnowledgeCompactOutput {
  summary: string;
  workspaceRoot: string;
  trustLevel: string;
  readiness: string;
  freshness: string;
  knownAreaCount: number;
  totalAreaCount: number;
  attentionAreaCount: number;
  suggestionCount: number;
  agentGuideReady: boolean;
  memoryPath: string;
  communicationBriefPath: string;
  attentionAreas: Array<{
    role: string;
    title: string;
    status: string;
    nextAction?: string;
  }>;
  areas: Array<{
    role: string;
    title: string;
    status: string;
    authority: string;
    sourcePaths: string[];
  }>;
}

export const runKnowledgeCommand = async (args: string[]): Promise<void> => {
  const parsed = parseKnowledgeArgs(args);
  const trust = await buildSkoposTrustRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
  });
  const result = await refreshSkoposMemoryState({
    workspaceRoot: parsed.cwd,
    trustLevel: trust.trustLevel,
    readiness: trust.readiness,
  });
  const compact = buildKnowledgeCompactOutput({
    workspaceRoot: parsed.cwd,
    trustLevel: trust.trustLevel,
    readiness: trust.readiness,
    memoryPath: result.memoryPath,
    communicationBriefPath: result.communicationBriefPath,
    memory: result.memory,
    agentGuideReady: Boolean(result.communicationBrief),
  });
  const output = parsed.compact
    ? compact
    : {
        ...compact,
        memory: result.memory,
        communicationBrief: result.communicationBrief,
      };

  if (parsed.json) {
    writeJsonOutput(
      projectJsonOutput(output, {
        summary: parsed.summary,
        fields: parsed.fields,
      }),
    );
    return;
  }

  if (parsed.summary) {
    writeLines(buildSummaryLines(output));
    return;
  }

  writeLines(buildKnowledgeLines(compact));
};

const buildKnowledgeCompactOutput = ({
  workspaceRoot,
  trustLevel,
  readiness,
  memoryPath,
  communicationBriefPath,
  memory,
  agentGuideReady,
}: {
  workspaceRoot: string;
  trustLevel: string;
  readiness: string;
  memoryPath: string;
  communicationBriefPath: string;
  memory: Awaited<ReturnType<typeof refreshSkoposMemoryState>>['memory'];
  agentGuideReady: boolean;
}): SkoposKnowledgeCompactOutput => {
  const knownAreas = memory.roles.filter((role) => role.status === 'mapped');
  const attentionAreas = memory.roles.filter((role) => role.status !== 'mapped');
  const suggestionById = new Map(memory.suggestions.map((suggestion) => [suggestion.id, suggestion]));

  return {
    summary: `${knownAreas.length}/${memory.roles.length} project knowledge areas known; ${attentionAreas.length} need attention; agent guide ${agentGuideReady ? 'ready' : 'missing'}.`,
    workspaceRoot,
    trustLevel,
    readiness,
    freshness: memory.freshness,
    knownAreaCount: knownAreas.length,
    totalAreaCount: memory.roles.length,
    attentionAreaCount: attentionAreas.length,
    suggestionCount: memory.suggestions.length,
    agentGuideReady,
    memoryPath,
    communicationBriefPath,
    attentionAreas: attentionAreas.map((role) => ({
      role: role.role,
      title: role.title,
      status: role.status,
      nextAction: role.suggestionIds
        .map((suggestionId) => suggestionById.get(suggestionId)?.nextAction)
        .find((nextAction): nextAction is string => Boolean(nextAction)),
    })),
    areas: memory.roles.map((role) => ({
      role: role.role,
      title: role.title,
      status: role.status,
      authority: role.authority,
      sourcePaths: role.sources.map((source) => source.path).slice(0, 4),
    })),
  };
};

const buildKnowledgeLines = (output: SkoposKnowledgeCompactOutput): string[] => [
  'Skopos project knowledge',
  `Status: ${output.knownAreaCount}/${output.totalAreaCount} areas known; ${output.attentionAreaCount} need attention`,
  `Freshness: ${output.freshness}`,
  `Readiness: ${output.readiness}`,
  `Agent guide: ${output.agentGuideReady ? 'ready' : 'missing'}`,
  '',
  'Use this before:',
  '- broad or risky agent work',
  '- docs, AGENTS, architecture, stack, or workflow changes',
  '- deciding whether project truth needs to be updated',
  '',
  output.attentionAreas.length > 0 ? 'Needs attention:' : 'No knowledge gaps found.',
  ...output.attentionAreas.map((area) =>
    `- ${area.title} [${area.status}]${area.nextAction ? `: ${area.nextAction}` : ''}`,
  ),
  '',
  'Known areas:',
  ...output.areas.slice(0, 8).map((area) => {
    const sourceText =
      area.sourcePaths.length > 0 ? area.sourcePaths.join(', ') : 'no source found yet';
    return `- ${area.title} [${area.status}]: ${sourceText}`;
  }),
  '',
  'Artifacts:',
  `- project knowledge: ${output.memoryPath}`,
  `- agent guide: ${output.communicationBriefPath}`,
];

const parseKnowledgeArgs = (args: string[]): ParsedKnowledgeArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let compact = false;
  let summary = false;
  let fields: string[] = [];
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--compact') {
      compact = true;
      continue;
    }

    if (argument === '--summary') {
      summary = true;
      continue;
    }

    if (argument === '--fields') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=')) {
      fields = parseFieldList(argument.slice('--fields='.length));
      continue;
    }

    if (argument === '--actor') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --actor.');
      }
      actor = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos knowledge flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  if (summary && fields.length > 0) {
    throw new Error('Use either --summary or --fields, not both.');
  }

  if (fields.length > 0 && !json) {
    throw new Error('Field selection requires --json.');
  }

  return { cwd, actor, compact, summary, fields, json };
};
