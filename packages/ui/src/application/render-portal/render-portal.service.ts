import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { assessSkoposProjectReadinessRuntime } from '@skopos/runtime';

import { loadSkoposUiActivityViews } from '../load-activity-views/load-activity-views.service.js';
import type { SkoposUiArtifactCounts } from '../../contracts/skopos-ui-portal.js';
import type { SkoposUiPortalRenderResult } from '../../contracts/skopos-ui-portal.js';
import { loadSkoposUiGraphViews } from '../load-graph-views/load-graph-views.service.js';

export interface RenderSkoposUiPortalOptions {
  cwd: string;
  outputPath?: string;
  dryRun?: boolean;
}

export const renderSkoposUiPortal = async ({
  cwd,
  outputPath,
  dryRun = false,
}: RenderSkoposUiPortalOptions): Promise<SkoposUiPortalRenderResult> => {
  const workspaceRoot = resolve(cwd);
  const graphViews = await loadSkoposUiGraphViews({
    cwd: workspaceRoot,
  });
  const activityViews = await loadSkoposUiActivityViews({
    cwd: workspaceRoot,
  });
  const proofSnapshot = await loadLatestProofSnapshot(workspaceRoot);
  const readinessReport = await assessSkoposProjectReadinessRuntime({
    cwd: workspaceRoot,
  });
  const artifactCounts = await collectArtifactCounts(workspaceRoot);
  const resolvedOutputPath = resolve(
    workspaceRoot,
    outputPath ?? '.skopos/ui/index.html',
  );
  const resolvedGraphPortalPath = resolve(dirname(resolvedOutputPath), 'graph-portal.html');
  const html = await buildPortalShellHtml({
    workspaceRoot,
    generatedAt: new Date().toISOString(),
    outputPath: resolvedOutputPath,
    graphPortalPath: resolvedGraphPortalPath,
    artifactCounts,
    readiness: readinessReport.readiness,
    readinessSummary: readinessReport.summary,
    checks: readinessReport.checks,
    readinessWarnings: readinessReport.warnings,
    readinessBlockers: readinessReport.blockers,
    activityViews,
    proofSnapshot,
    graphViews,
  });
  const graphHtml = buildGraphPortalHtml({
    workspaceRoot,
    generatedAt: new Date().toISOString(),
    graphViews,
  });

  if (!dryRun) {
    await mkdir(dirname(resolvedOutputPath), { recursive: true });
    await writeFile(resolvedOutputPath, html, 'utf8');
    await writeFile(resolvedGraphPortalPath, graphHtml, 'utf8');
  }

  return {
    workspaceRoot,
    outputPath: resolvedOutputPath,
    graphPortalPath: resolvedGraphPortalPath,
    writeStatus: dryRun ? 'dry-run' : 'written',
    graphPortalWriteStatus: dryRun ? 'dry-run' : 'written',
    graphCount: graphViews.graphs.length,
    readiness: readinessReport.readiness,
    readinessSummary: readinessReport.summary,
    artifactCounts,
    html,
    graphHtml,
  };
};

interface BuildPortalHtmlOptions {
  workspaceRoot: string;
  generatedAt: string;
  graphViews: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>;
}

interface BuildPortalShellHtmlOptions extends BuildPortalHtmlOptions {
  outputPath: string;
  graphPortalPath: string;
  artifactCounts: SkoposUiArtifactCounts;
  readiness: SkoposUiPortalRenderResult['readiness'];
  readinessSummary: string;
  checks: Array<{ id: string; status: 'pass' | 'warn' | 'fail'; summary: string }>;
  readinessWarnings: string[];
  readinessBlockers: string[];
  activityViews: Awaited<ReturnType<typeof loadSkoposUiActivityViews>>;
  proofSnapshot?: SkoposUiProofSnapshot;
}

interface SkoposUiProofSnapshot {
  artifactPath: string;
  status: 'pass' | 'fail';
  comparisonStatus: 'pass' | 'fail';
  benchmarkCount: number;
  failedBenchmarks: number;
  weightedPassRate: number;
  categoryCount: number;
  updatedAt?: string;
  categories: Array<{
    category: string;
    benchmarkCount: number;
    weightedPassRate: number;
  }>;
}

const buildPortalShellHtml = async ({
  workspaceRoot,
  generatedAt,
  outputPath,
  graphPortalPath,
  artifactCounts,
  readiness,
  readinessSummary,
  checks,
  readinessWarnings,
  readinessBlockers,
  activityViews,
  proofSnapshot,
  graphViews,
}: BuildPortalShellHtmlOptions): Promise<string> => {
  const workspaceLabel = basename(workspaceRoot);
  const activeTasks = activityViews.tasks.filter((task) => task.state !== 'complete');
  const activeTaskCount = activeTasks.length;
  const warningCheckCount = checks.filter((check) => check.status === 'warn').length;
  const failedCheckCount = checks.filter((check) => check.status === 'fail').length;
  const docsStartLink = await buildPortalLink(
    outputPath,
    join(workspaceRoot, 'docs', '00-start-here.md'),
    'Docs start here',
  );
  const graphPortalLink = await buildPortalLink(
    outputPath,
    graphPortalPath,
    'Graph portal',
    true,
  );
  const proofReportLink = await buildPortalLink(
    outputPath,
    join(workspaceRoot, '.skopos', 'evidence', 'proof', 'latest-report.json'),
    'Latest proof report',
  );
  const links = [
    docsStartLink,
    await buildPortalLink(outputPath, join(workspaceRoot, 'AGENTS.md'), 'Canonical instructions'),
    await buildPortalLink(outputPath, join(workspaceRoot, 'skopos.config.yaml'), 'Root config'),
    await buildPortalLink(
      outputPath,
      join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'),
      'Bootstrap artifact',
    ),
    await buildPortalLink(
      outputPath,
      join(workspaceRoot, '.skopos', 'index', 'diagnosis.json'),
      'Diagnosis artifact',
    ),
    await buildPortalLink(
      outputPath,
      join(workspaceRoot, '.skopos', 'index', 'scopes.json'),
      'Scopes-lite artifact',
    ),
    proofReportLink,
    graphPortalLink,
  ];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Skopos Console</title>
    <style>
      :root {
        --bg: #f6f4ef;
        --sidebar: #f1eee8;
        --panel: #fffdf8;
        --panel-strong: #ffffff;
        --ink: #191714;
        --muted: #6d675f;
        --line: #ded7cb;
        --accent: #155e52;
        --accent-soft: #dcefe9;
        --warn: #a86315;
        --warn-soft: #f8e3c4;
        --danger: #b42318;
        --danger-soft: #fddfdc;
        --focus: #2457f5;
        --focus-soft: #e1e9ff;
        --shadow: 0 18px 40px rgba(25, 23, 20, 0.06);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(36, 87, 245, 0.05), transparent 28rem),
          linear-gradient(180deg, #fbfaf7 0%, var(--bg) 100%);
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      h1, h2, h3, p {
        margin: 0;
      }
      code {
        font-family: "SFMono-Regular", "SF Mono", Menlo, Consolas, monospace;
        font-size: 0.92em;
      }
      .app-shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 248px minmax(0, 1fr);
      }
      .sidebar {
        border-right: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.42) 0%, rgba(241, 238, 232, 0.95) 100%);
        padding: 18px 14px 22px;
        display: grid;
        align-content: start;
        gap: 16px;
      }
      .brand-block,
      .workspace-chip,
      .sidebar-section,
      .topbar,
      .hero,
      .panel,
      .rail-card,
      .metric-card {
        border: 1px solid var(--line);
        background: var(--panel);
        box-shadow: var(--shadow);
      }
      .brand-block {
        border-radius: 18px;
        padding: 14px 14px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .brand-mark {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: var(--accent);
        background: var(--accent-soft);
      }
      .brand-copy {
        display: grid;
        gap: 2px;
      }
      .brand-copy strong {
        font-size: 1rem;
        letter-spacing: -0.02em;
      }
      .brand-copy span,
      .sidebar-note,
      .section-copy,
      .meta-copy,
      .item-meta,
      .muted {
        color: var(--muted);
      }
      .workspace-chip {
        border-radius: 16px;
        padding: 12px 14px;
        display: grid;
        gap: 6px;
      }
      .workspace-chip strong {
        font-size: 0.95rem;
      }
      .workspace-chip code {
        color: var(--muted);
      }
      .sidebar-section {
        border-radius: 16px;
        padding: 12px 12px 10px;
        display: grid;
        gap: 8px;
      }
      .section-label {
        color: var(--muted);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .nav-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-radius: 12px;
        padding: 9px 10px;
        font-size: 0.95rem;
        color: var(--ink);
      }
      .nav-link:hover {
        background: rgba(21, 94, 82, 0.08);
      }
      .nav-pill {
        border-radius: 999px;
        padding: 3px 7px;
        background: rgba(36, 87, 245, 0.08);
        color: var(--focus);
        font-size: 0.72rem;
        font-weight: 700;
      }
      .sidebar-summary {
        gap: 10px;
      }
      .mini-metric {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.72);
        padding: 10px 11px;
        display: grid;
        gap: 4px;
      }
      .mini-metric strong {
        font-size: 1rem;
      }
      .app-main {
        padding: 18px;
        display: grid;
        gap: 16px;
      }
      .topbar {
        border-radius: 20px;
        padding: 14px 18px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px 18px;
      }
      .breadcrumbs {
        color: var(--muted);
        font-size: 0.86rem;
      }
      .topbar-copy {
        display: grid;
        gap: 6px;
      }
      .topbar-copy h1 {
        font-size: clamp(1.7rem, 3vw, 2.4rem);
        letter-spacing: -0.03em;
      }
      .topbar-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .action-link {
        border-radius: 12px;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        padding: 9px 12px;
        font-size: 0.92rem;
      }
      .page-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
        gap: 16px;
        align-items: start;
      }
      .content-stack,
      .detail-rail {
        display: grid;
        gap: 16px;
      }
      .hero,
      .panel,
      .rail-card,
      .metric-card {
        border-radius: 22px;
        padding: 18px 20px;
      }
      .hero {
        display: grid;
        gap: 16px;
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(248, 245, 239, 0.95)),
          linear-gradient(180deg, var(--panel), var(--panel));
      }
      .hero-kicker {
        color: var(--muted);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .hero h2 {
        font-size: clamp(1.8rem, 3vw, 2.6rem);
        letter-spacing: -0.03em;
      }
      .hero-copy,
      .section-copy {
        max-width: 68ch;
        line-height: 1.55;
      }
      .hero-chips,
      .section-head {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px 16px;
      }
      .hero-chips {
        align-items: center;
      }
      .status {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 0.77rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .status.high, .status.agent-ready, .status.pass { background: var(--accent-soft); color: var(--accent); }
      .status.medium, .status.needs-review, .status.warn { background: var(--warn-soft); color: var(--warn); }
      .status.low, .status.bootstrap-needed, .status.fail { background: var(--danger-soft); color: var(--danger); }
      .summary-strip,
      .list-grid,
      .module-grid {
        display: grid;
        gap: 14px;
      }
      .summary-strip {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }
      .metric-card {
        background: var(--panel-strong);
        display: grid;
        gap: 6px;
      }
      .metric-card strong {
        display: block;
        font-size: 1.7rem;
        letter-spacing: -0.03em;
      }
      .metric-card span {
        color: var(--muted);
        font-size: 0.9rem;
      }
      .section-head h2,
      .rail-card h2 {
        font-size: 1.15rem;
        letter-spacing: -0.02em;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
        font-size: 0.94rem;
      }
      th, td {
        text-align: left;
        vertical-align: top;
        padding: 10px 8px;
        border-bottom: 1px solid rgba(222, 215, 203, 0.75);
      }
      th {
        color: var(--muted);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .module-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .board-grid,
      .story-grid {
        display: grid;
        gap: 14px;
      }
      .board-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
      }
      .board-card {
        grid-column: span 6;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.8);
        border-radius: 20px;
        padding: 16px 18px;
        display: grid;
        gap: 12px;
      }
      .board-card-wide {
        grid-column: span 7;
      }
      .board-card-narrow {
        grid-column: span 5;
      }
      .story-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      .module-card {
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.76);
        border-radius: 18px;
        padding: 14px 16px;
        display: grid;
        gap: 8px;
      }
      .eyebrow,
      .subtle-label {
        color: var(--muted);
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }
      .subtle-label {
        text-transform: none;
        letter-spacing: 0;
        font-size: 0.8rem;
      }
      .board-stats,
      .inline-metrics,
      .inline-route-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .inline-metrics span,
      .inline-route-list a,
      .board-stats span {
        border-radius: 999px;
        padding: 6px 10px;
        border: 1px solid rgba(222, 215, 203, 0.92);
        background: rgba(255, 255, 255, 0.74);
        font-size: 0.84rem;
      }
      .board-stats strong {
        font-size: 1rem;
      }
      .list-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }
      .list-card,
      .artifact-row,
      .attention-row {
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.78);
      }
      .list-card {
        padding: 14px 16px;
        display: grid;
        gap: 10px;
      }
      .list-card h3 {
        font-size: 1rem;
        letter-spacing: -0.02em;
      }
      .rows {
        display: grid;
        gap: 8px;
      }
      .item-row,
      .artifact-row,
      .attention-row {
        padding: 10px 12px;
      }
      .item-row {
        border-top: 1px solid rgba(222, 215, 203, 0.72);
        display: grid;
        gap: 4px;
      }
      .item-row:first-child {
        border-top: 0;
        padding-top: 0;
      }
      .item-title {
        font-size: 0.95rem;
        font-weight: 600;
      }
      .item-title-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .item-summary {
        color: var(--muted);
        line-height: 1.5;
        font-size: 0.92rem;
      }
      .item-time {
        color: var(--muted);
        font-size: 0.82rem;
      }
      .task-chip-list,
      .highlight-pill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .task-chip,
      .highlight-pill {
        border-radius: 999px;
        padding: 4px 8px;
        background: rgba(21, 94, 82, 0.08);
        color: var(--accent);
        font-size: 0.78rem;
        font-weight: 600;
      }
      .highlight-pill {
        background: rgba(36, 87, 245, 0.08);
        color: var(--focus);
      }
      .detail-rail {
        position: sticky;
        top: 18px;
      }
      .rail-card {
        display: grid;
        gap: 12px;
      }
      .fact-list {
        display: grid;
        gap: 10px;
        margin: 0;
      }
      .fact-list div {
        display: grid;
        gap: 3px;
      }
      .fact-list dt {
        color: var(--muted);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }
      .fact-list dd {
        margin: 0;
        font-size: 0.96rem;
      }
      .artifact-list,
      .attention-list {
        display: grid;
        gap: 10px;
      }
      .artifact-row a,
      .action-link,
      .module-card a {
        color: var(--focus);
      }
      .disclosure {
        border-top: 1px solid rgba(222, 215, 203, 0.72);
        padding-top: 10px;
      }
      .disclosure summary {
        cursor: pointer;
        color: var(--focus);
        font-size: 0.88rem;
        font-weight: 600;
      }
      .disclosure[open] summary {
        margin-bottom: 8px;
      }
      .disclosure pre,
      .disclosure code {
        white-space: pre-wrap;
        word-break: break-word;
      }
      .disclosure-block {
        display: grid;
        gap: 8px;
        color: var(--muted);
        font-size: 0.9rem;
      }
      .proof-categories {
        display: grid;
        gap: 8px;
      }
      .proof-category {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        border-top: 1px solid rgba(222, 215, 203, 0.72);
        padding-top: 8px;
      }
      .proof-category:first-child {
        border-top: 0;
        padding-top: 0;
      }
      .surface-meta {
        display: grid;
        gap: 6px;
      }
      @media (max-width: 1080px) {
        .app-shell {
          grid-template-columns: 1fr;
        }
        .sidebar {
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
        .page-grid {
          grid-template-columns: 1fr;
        }
        .board-card,
        .board-card-wide,
        .board-card-narrow {
          grid-column: span 12;
        }
        .detail-rail {
          position: static;
        }
      }
      @media (max-width: 720px) {
        .app-main {
          padding: 14px;
        }
        .topbar {
          padding: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <div class="brand-mark">SK</div>
          <div class="brand-copy">
            <strong>Skopos</strong>
            <span>system ui</span>
          </div>
        </div>

        <div class="workspace-chip">
          <span class="section-label">Workspace</span>
          <strong>${escapeHtml(workspaceLabel)}</strong>
          <code>${escapeHtml(workspaceRoot)}</code>
        </div>

        <div class="sidebar-section">
          <span class="section-label">Navigate</span>
          <a class="nav-link" href="#overview">Overview <span class="nav-pill">home</span></a>
          <a class="nav-link" href="#execution">Execution <span class="nav-pill">${activeTaskCount}</span></a>
          <a class="nav-link" href="#readiness">Readiness <span class="nav-pill">${escapeHtml(readiness)}</span></a>
          <a class="nav-link" href="#operations">Scopes <span class="nav-pill">${graphViews.graphs.length}</span></a>
          <a class="nav-link" href="#activity">Activity <span class="nav-pill">${activityViews.operationalEvents.length}</span></a>
        </div>

        <div class="sidebar-section">
          <span class="section-label">Inspect</span>
          <a class="nav-link" href="#proof">Proof <span class="nav-pill">${proofSnapshot ? proofSnapshot.benchmarkCount : 0}</span></a>
          <a class="nav-link" href="#artifacts">Artifacts <span class="nav-pill">${links.length}</span></a>
          <a class="nav-link" href="${escapeHtml(graphPortalLink.href)}">Graph portal <span class="nav-pill">open</span></a>
        </div>

        <div class="sidebar-section sidebar-summary">
          <span class="section-label">Status</span>
          <div class="mini-metric">
            <span class="sidebar-note">Readiness</span>
            <strong>${escapeHtml(readiness)}</strong>
          </div>
          <div class="mini-metric">
            <span class="sidebar-note">Readiness</span>
            <strong>${escapeHtml(readiness)}</strong>
          </div>
          <div class="mini-metric">
            <span class="sidebar-note">Active tasks</span>
            <strong>${activeTaskCount}</strong>
          </div>
        </div>
      </aside>

      <main class="app-main">
        <header class="topbar">
          <div class="topbar-copy">
            <p class="breadcrumbs">Skopos / ${escapeHtml(workspaceLabel)} / Overview</p>
            <h1>Project intelligence console</h1>
            <p class="meta-copy">Human-facing workspace state for readiness, proof, docs, actions, and task execution.</p>
          </div>
          <div class="topbar-actions">
            <a class="action-link" href="${escapeHtml(docsStartLink.href)}">Open docs</a>
            <a class="action-link" href="${escapeHtml(graphPortalLink.href)}">Open graphs</a>
            ${
              proofReportLink.exists
                ? `<a class="action-link" href="${escapeHtml(proofReportLink.href)}">Open proof report</a>`
                : ''
            }
          </div>
        </header>

        <div class="page-grid">
          <div class="content-stack">
            <section id="overview" class="hero">
              <div class="hero-intro">
                <div class="hero-kicker">Workspace overview</div>
                <h2>${escapeHtml(workspaceLabel)}</h2>
                <p class="hero-copy">${escapeHtml(readinessSummary)}</p>
              </div>
              <div class="hero-chips">
                <span class="status ${escapeHtml(readiness)}">readiness ${escapeHtml(readiness)}</span>
                <span class="status ${escapeHtml(readiness)}">${escapeHtml(readiness)}</span>
                ${
                  proofSnapshot
                    ? `<span class="status ${escapeHtml(proofSnapshot.status)}">proof ${escapeHtml(proofSnapshot.status)}</span>`
                    : '<span class="status warn">proof unavailable</span>'
                }
                <span class="muted">generated ${escapeHtml(generatedAt)}</span>
              </div>
            </section>

            <section class="summary-strip">
              <article class="metric-card">
                <span>Active tasks</span>
                <strong>${activeTaskCount}</strong>
                <span>${artifactCounts.tasks} persisted tasks</span>
              </article>
              <article class="metric-card">
                <span>Action evidence</span>
                <strong>${artifactCounts.runs}</strong>
                <span>${activityViews.actionRuns.length} recent runs</span>
              </article>
              <article class="metric-card">
                <span>Graph views</span>
                <strong>${graphViews.graphs.length}</strong>
                <span>${artifactCounts.graphArtifacts} graph artifacts</span>
              </article>
              <article class="metric-card">
                <span>Proof benchmarks</span>
                <strong>${proofSnapshot ? proofSnapshot.benchmarkCount : 0}</strong>
                <span>${proofSnapshot ? `${proofSnapshot.failedBenchmarks} failed` : 'no proof report yet'}</span>
              </article>
              <article class="metric-card">
                <span>Attention</span>
                <strong>${failedCheckCount + warningCheckCount + readinessBlockers.length}</strong>
                <span>${failedCheckCount} failures · ${warningCheckCount} warnings · ${readinessBlockers.length} readinessBlockers</span>
              </article>
            </section>

            ${renderExecutionCockpit({
              activityViews,
              proofSnapshot,
            })}

            ${renderReadinessSurface({
              checks,
              readinessWarnings,
              readinessBlockers,
            })}

            ${renderOperationalModules({
              outputPath,
              graphPortalPath,
              graphViews,
            })}

            ${renderActivitySection(activityViews)}
          </div>

          <aside class="detail-rail">
            <section class="rail-card">
              <h2>Current state</h2>
              <dl class="fact-list">
                <div>
                  <dt>Workspace</dt>
                  <dd><code>${escapeHtml(workspaceRoot)}</code></dd>
                </div>
                <div>
                  <dt>Readiness</dt>
                  <dd><span class="status ${escapeHtml(readiness)}">${escapeHtml(readiness)}</span></dd>
                </div>
                <div>
                  <dt>Readiness</dt>
                  <dd><span class="status ${escapeHtml(readiness)}">${escapeHtml(readiness)}</span></dd>
                </div>
                <div>
                  <dt>Generated</dt>
                  <dd><code>${escapeHtml(generatedAt)}</code></dd>
                </div>
              </dl>
              <div class="inline-route-list">
                <a href="${escapeHtml(docsStartLink.href)}">Docs start</a>
                <a href="${escapeHtml(graphPortalLink.href)}">Graph portal</a>
                ${
                  proofReportLink.exists
                    ? `<a href="${escapeHtml(proofReportLink.href)}">Proof report</a>`
                    : ''
                }
              </div>
            </section>

            <section id="proof" class="rail-card">
              <h2>Proof snapshot</h2>
              ${
                proofSnapshot
                  ? `<dl class="fact-list">
                      <div>
                        <dt>Status</dt>
                        <dd><span class="status ${escapeHtml(proofSnapshot.status)}">${escapeHtml(proofSnapshot.status)}</span></dd>
                      </div>
                      <div>
                        <dt>Benchmarks</dt>
                        <dd>${proofSnapshot.benchmarkCount}</dd>
                      </div>
                      <div>
                        <dt>Weighted pass rate</dt>
                        <dd>${formatPercent(proofSnapshot.weightedPassRate)}</dd>
                      </div>
                      <div>
                        <dt>Comparison</dt>
                        <dd><span class="status ${escapeHtml(proofSnapshot.comparisonStatus)}">${escapeHtml(proofSnapshot.comparisonStatus)}</span></dd>
                      </div>
                    </dl>
                    <div class="proof-categories">
                      ${proofSnapshot.categories
                        .slice(0, 4)
                        .map(
                          (category) => `<div class="proof-category">
                          <span>${escapeHtml(category.category)}</span>
                          <span class="muted">${category.benchmarkCount} · ${formatPercent(category.weightedPassRate)}</span>
                        </div>`,
                        )
                        .join('')}
                    </div>
                    <div class="artifact-row">
                      <div class="item-title">Latest proof report</div>
                      <div class="item-summary"><code>${escapeHtml(proofSnapshot.artifactPath)}</code></div>
                      <div class="item-meta"><a href="${escapeHtml(proofReportLink.href)}">Open artifact</a></div>
                    </div>`
                  : '<div class="attention-row"><div class="item-summary">No proof report recorded yet. Run the proof lane to populate the system UI proof surface.</div></div>'
              }
            </section>

            <section id="artifacts" class="rail-card">
              <h2>Core artifacts</h2>
              <p class="section-copy">Authoritative entrypoints and generated evidence behind the current console view.</p>
              <details class="disclosure" open>
                <summary>Open artifact list</summary>
                <div class="artifact-list">
                  ${links
                    .map(
                      (link) => `<div class="artifact-row">
                      <div class="item-title">${escapeHtml(link.label)}</div>
                      <div class="item-summary"><code>${escapeHtml(link.displayPath)}</code></div>
                      <div class="item-meta">${link.exists ? `<a href="${escapeHtml(link.href)}">Open</a>` : 'Missing'}</div>
                    </div>`,
                    )
                    .join('\n')}
                </div>
              </details>
            </section>

            <section class="rail-card">
              <h2>Attention</h2>
              <div class="attention-list">
                <div class="attention-row">
                  <div class="item-title">Unresolved Readiness warnings</div>
                  ${
                    readinessWarnings.length > 0
                      ? `<div class="item-summary">${readinessWarnings.map(escapeHtml).join(' · ')}</div>`
                      : '<div class="item-summary">No unresolved Readiness warnings in the current Readiness snapshot.</div>'
                  }
                </div>
                <div class="attention-row">
                  <div class="item-title">Bootstrap readinessBlockers</div>
                  ${
                    readinessBlockers.length > 0
                      ? `<div class="item-summary">${readinessBlockers.map(escapeHtml).join(' · ')}</div>`
                      : '<div class="item-summary">No active bootstrap readinessBlockers.</div>'
                  }
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  </body>
</html>`;
};

const buildGraphPortalHtml = ({
  workspaceRoot,
  generatedAt,
  graphViews,
}: BuildPortalHtmlOptions): string => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Skopos Graph Portal</title>
    <style>
      :root {
        --bg: #f3efe6;
        --panel: #fffaf0;
        --ink: #1b1a17;
        --muted: #665f55;
        --line: #d5c8b5;
        --accent: #0f766e;
        --accent-soft: #d4f0ec;
        --warn: #b45309;
        --warn-soft: #fde7c7;
        --focus: #1d4ed8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.08), transparent 32rem),
          linear-gradient(180deg, #fbf7ef 0%, var(--bg) 100%);
      }
      main {
        max-width: 1120px;
        margin: 0 auto;
        padding: 40px 20px 64px;
      }
      header {
        display: grid;
        gap: 14px;
        margin-bottom: 28px;
      }
      h1, h2, h3 {
        margin: 0;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      h1 { font-size: clamp(2.4rem, 4vw, 4rem); }
      h2 { font-size: 1.35rem; }
      h3 { font-size: 1rem; }
      p, li { line-height: 1.55; }
      .lede {
        color: var(--muted);
        max-width: 72ch;
        font-size: 1.05rem;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        color: var(--muted);
        font-size: 0.95rem;
      }
      .meta span,
      .stat {
        border: 1px solid var(--line);
        background: rgba(255, 250, 240, 0.7);
        padding: 8px 10px;
        border-radius: 999px;
      }
      .overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
        margin-bottom: 28px;
      }
      .stat {
        border-radius: 18px;
        padding: 14px 16px;
        background: var(--panel);
      }
      .stat strong {
        display: block;
        font-size: 1.5rem;
      }
      .graphs {
        display: grid;
        gap: 18px;
      }
      .graph-card {
        border: 1px solid var(--line);
        background: var(--panel);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 18px 50px rgba(27, 26, 23, 0.07);
      }
      .graph-head {
        padding: 20px 22px 18px;
        border-bottom: 1px solid var(--line);
        display: grid;
        gap: 10px;
      }
      .graph-kind {
        display: inline-flex;
        width: fit-content;
        padding: 5px 10px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .graph-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
        gap: 0;
      }
      .graph-section {
        padding: 20px 22px 22px;
      }
      .graph-section + .graph-section {
        border-left: 1px solid var(--line);
      }
      .highlight-groups {
        display: grid;
        gap: 12px;
      }
      .highlight-group {
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 12px 14px;
        background: rgba(255, 255, 255, 0.55);
      }
      .highlight-group ul {
        margin: 10px 0 0;
        padding-left: 18px;
      }
      .artifact {
        margin-top: 10px;
        color: var(--muted);
        font-size: 0.9rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
        font-size: 0.95rem;
      }
      th, td {
        text-align: left;
        vertical-align: top;
        padding: 9px 10px;
        border-bottom: 1px solid rgba(213, 200, 181, 0.65);
      }
      th {
        color: var(--muted);
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .state {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .state.required { background: var(--warn-soft); color: var(--warn); }
      .state.recommended { background: #dbeafe; color: var(--focus); }
      .state.active,
      .state.complete,
      .state.generated,
      .state.changed,
      .state.warning { background: var(--accent-soft); color: var(--accent); }
      code {
        font-family: "SFMono-Regular", "SF Mono", Menlo, Consolas, monospace;
        font-size: 0.92em;
      }
      @media (max-width: 880px) {
        .graph-grid {
          grid-template-columns: 1fr;
        }
        .graph-section + .graph-section {
          border-left: 0;
          border-top: 1px solid var(--line);
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="graph-kind">Skopos Portal</div>
        <h1>Graph Portal</h1>
        <p class="lede">Curated relationship views generated from Skopos graph artifacts. This portal stays focused on high-signal workspace, docs, commands, scope-relations, task, and impact slices instead of broad repo-wide graph noise.</p>
        <div class="meta">
          <span><strong>Workspace:</strong> <code>${escapeHtml(workspaceRoot)}</code></span>
          <span><strong>Generated:</strong> <code>${escapeHtml(generatedAt)}</code></span>
        </div>
      </header>

      <section class="overview">
        <div class="stat"><strong>${graphViews.graphs.length}</strong> graph views</div>
        <div class="stat"><strong>${graphViews.graphs.reduce((count, graph) => count + graph.nodeCount, 0)}</strong> total nodes</div>
        <div class="stat"><strong>${graphViews.graphs.reduce((count, graph) => count + graph.edgeCount, 0)}</strong> total edges</div>
      </section>

      <section class="graphs">
        ${graphViews.graphs.map(renderGraphCard).join('\n')}
      </section>
    </main>
  </body>
</html>`;

interface PortalLink {
  label: string;
  displayPath: string;
  href: string;
  exists: boolean;
}

const buildPortalLink = async (
  outputPath: string,
  targetPath: string,
  label: string,
  expectedToExist = false,
): Promise<PortalLink> => ({
  label,
  displayPath: targetPath,
  href: toRelativeLink(outputPath, targetPath),
  exists: expectedToExist ? true : await pathExists(targetPath),
});

const collectArtifactCounts = async (workspaceRoot: string): Promise<SkoposUiArtifactCounts> => ({
  plans: await countFiles(join(workspaceRoot, 'docs', 'work', 'plans'), '.md'),
  tasks: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'tasks')),
  runs: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'runs')),
  graphArtifacts: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'graph')),
});

const countJsonArtifacts = async (directoryPath: string): Promise<number> => {
  return countFiles(directoryPath, '.json');
};

const countFiles = async (directoryPath: string, extension: string): Promise<number> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const counts = await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? countFiles(join(directoryPath, entry.name), extension)
          : Number(entry.isFile() && entry.name.endsWith(extension)),
      ),
    );
    return counts.reduce((sum, count) => sum + count, 0);
  } catch {
    return 0;
  }
};

const loadLatestProofSnapshot = async (
  workspaceRoot: string,
): Promise<SkoposUiProofSnapshot | undefined> => {
  const artifactPath = join(workspaceRoot, '.skopos', 'evidence', 'proof', 'latest-report.json');

  try {
    const raw = await readFile(artifactPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      updatedAt?: string;
      scorecard?: {
        status?: 'pass' | 'fail';
        benchmarkCount?: number;
        failedBenchmarks?: number;
        weightedPassRate?: number;
        categorySummaries?: Array<{
          category: string;
          benchmarkCount: number;
          weightedPassRate: number;
        }>;
      };
      comparison?: {
        status?: 'pass' | 'fail';
      };
    };

    if (!parsed.scorecard?.status) {
      return undefined;
    }

    return {
      artifactPath,
      status: parsed.scorecard.status,
      comparisonStatus: parsed.comparison?.status ?? 'fail',
      benchmarkCount: parsed.scorecard.benchmarkCount ?? 0,
      failedBenchmarks: parsed.scorecard.failedBenchmarks ?? 0,
      weightedPassRate: parsed.scorecard.weightedPassRate ?? 0,
      categoryCount: parsed.scorecard.categorySummaries?.length ?? 0,
      updatedAt: parsed.updatedAt,
      categories: parsed.scorecard.categorySummaries ?? [],
    };
  } catch {
    return undefined;
  }
};

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const toRelativeLink = (fromFilePath: string, targetPath: string): string => {
  const relativePath = relative(dirname(fromFilePath), targetPath);
  return relativePath.length === 0 ? '.' : relativePath.replaceAll('\\', '/');
};

const renderExecutionCockpit = ({
  activityViews,
  proofSnapshot,
}: {
  activityViews: Awaited<ReturnType<typeof loadSkoposUiActivityViews>>;
  proofSnapshot?: SkoposUiProofSnapshot;
}): string => {
  const activeTasks = activityViews.tasks.filter((task) => task.state !== 'complete');
  const featuredTasks = (activeTasks.length > 0 ? activeTasks : activityViews.tasks).slice(0, 4);
  const featuredPlans = activityViews.plans.slice(0, 3);
  const featuredRuns = activityViews.actionRuns.slice(0, 4);

  return `<section id="execution" class="panel">
            <div class="section-head">
              <div>
                <h2>Execution cockpit</h2>
                <p class="section-copy">The main human review surface for active tasks, recent planning intent, action evidence, and proof posture.</p>
              </div>
            </div>
            <div class="board-grid">
              <article class="board-card board-card-wide">
                <div class="eyebrow">Task focus</div>
                <div class="board-stats">
                  <span><strong>${activeTasks.length}</strong> active task${activeTasks.length === 1 ? '' : 's'}</span>
                  <span><strong>${featuredPlans.length}</strong> recent plan${featuredPlans.length === 1 ? '' : 's'}</span>
                </div>
                <div class="rows">
                  ${
                    featuredTasks.length > 0
                      ? featuredTasks
                          .map(
                            (task) => `<div class="item-row">
                              <div class="item-title-line">
                                <div class="item-title">${escapeHtml(task.title)}</div>
                                <span class="status ${escapeHtml(mapTaskStateToStatus(task.state))}">${escapeHtml(task.state)}</span>
                              </div>
                              <div class="item-meta">${escapeHtml(task.scopeId)} · ${task.pendingStepCount} pending${task.childTaskCount > 0 ? ` · ${task.childTaskCount} slice${task.childTaskCount === 1 ? '' : 's'}` : ''}${task.claimedByActorId ? ` · claimed by: ${escapeHtml(task.claimedByActorId)}` : ''}</div>
                              <div class="item-summary">${escapeHtml(task.summary)}</div>
                              ${
                                task.selectedActionIds.length > 0
                                  ? `<div class="task-chip-list">${task.selectedActionIds
                                      .slice(0, 4)
                                      .map((actionId) => `<span class="task-chip">${escapeHtml(actionId)}</span>`)
                                      .join('')}</div>`
                                  : ''
                              }
                              <details class="disclosure">
                                <summary>Task artifact</summary>
                                <div class="disclosure-block">
                                  ${
                                    task.parentTaskId
                                      ? `<div>parent: ${escapeHtml(task.parentTaskId)}</div>`
                                      : ''
                                  }
                                  ${
                                    task.lastUpdatedByActorId
                                      ? `<div>updated by: ${escapeHtml(task.lastUpdatedByActorId)}</div>`
                                      : ''
                                  }
                                  <code>${escapeHtml(task.artifactPath)}</code>
                                </div>
                              </details>
                            </div>`,
                          )
                          .join('\n')
                      : '<div class="item-row"><div class="item-summary">No persisted tasks yet.</div></div>'
                  }
                </div>
                <details class="disclosure">
                  <summary>Recent plans</summary>
                  <div class="rows">
                    ${
                      featuredPlans.length > 0
                        ? featuredPlans
                            .map(
                              (plan) => `<div class="item-row">
                                <div class="item-title">${escapeHtml(plan.title)}</div>
                                <div class="item-meta">${escapeHtml(plan.scopeId)} · ${escapeHtml(plan.confidence)}${plan.createdByActorId ? ` · planned by ${escapeHtml(plan.createdByActorId)}` : ''}</div>
                                <div class="item-summary">${escapeHtml(plan.goal)}</div>
                                <code>${escapeHtml(plan.artifactPath)}</code>
                              </div>`,
                            )
                            .join('\n')
                        : '<div class="item-row"><div class="item-summary">No persisted plans yet.</div></div>'
                    }
                  </div>
                </details>
              </article>

              <article class="board-card board-card-narrow">
                <div class="eyebrow">Action evidence</div>
                <div class="board-stats">
                  <span><strong>${featuredRuns.length}</strong> recent run${featuredRuns.length === 1 ? '' : 's'}</span>
                  <span><strong>${activityViews.actionRuns.filter((run) => run.runStatus === 'succeeded').length}</strong> succeeded</span>
                </div>
                <div class="rows">
                  ${
                    featuredRuns.length > 0
                      ? featuredRuns
                          .map(
                            (run) => `<div class="item-row">
                              <div class="item-title-line">
                                <div class="item-title">${escapeHtml(run.actionTitle)}</div>
                                <span class="status ${escapeHtml(mapActionStatusToStatus(run.runStatus))}">${escapeHtml(run.runStatus)}</span>
                              </div>
                              <div class="item-meta"><code>${escapeHtml(run.actionId)}</code>${run.runByActorId ? ` · run by: ${escapeHtml(run.runByActorId)}` : ''}${run.finishedAt ? ` · ${escapeHtml(run.finishedAt)}` : ''}</div>
                              <div class="item-summary">${run.outputPaths.length > 0 ? escapeHtml(run.outputPaths.join(', ')) : 'No output paths recorded.'}</div>
                              <details class="disclosure">
                                <summary>Run artifact</summary>
                                <div class="disclosure-block">
                                  <code>${escapeHtml(run.artifactPath)}</code>
                                </div>
                              </details>
                            </div>`,
                          )
                          .join('\n')
                      : '<div class="item-row"><div class="item-summary">No action runs recorded yet.</div></div>'
                  }
                </div>
              </article>

              <article class="board-card board-card-narrow">
                <div class="eyebrow">Proof posture</div>
                ${
                  proofSnapshot
                    ? `<div class="inline-metrics">
                        <span><strong>${proofSnapshot.benchmarkCount}</strong> benchmarks</span>
                        <span><strong>${formatPercent(proofSnapshot.weightedPassRate)}</strong> weighted pass</span>
                        <span><strong>${proofSnapshot.failedBenchmarks}</strong> failed</span>
                      </div>
                      <div class="item-summary">Latest proof report is ${escapeHtml(proofSnapshot.status)} against a ${escapeHtml(proofSnapshot.comparisonStatus)} baseline comparison.</div>
                      <div class="proof-categories">
                        ${proofSnapshot.categories
                          .slice(0, 5)
                          .map(
                            (category) => `<div class="proof-category">
                              <span>${escapeHtml(category.category)}</span>
                              <span class="muted">${category.benchmarkCount} · ${formatPercent(category.weightedPassRate)}</span>
                            </div>`,
                          )
                          .join('')}
                      </div>
                      <details class="disclosure">
                        <summary>Proof artifact</summary>
                        <div class="disclosure-block">
                          <code>${escapeHtml(proofSnapshot.artifactPath)}</code>
                        </div>
                      </details>`
                    : '<div class="item-summary">No proof report recorded yet. Run the proof lane to populate this view.</div>'
                }
              </article>
            </div>
          </section>`;
};

const renderReadinessSurface = ({
  checks,
  readinessWarnings,
  readinessBlockers,
}: {
  checks: Array<{ id: string; status: 'pass' | 'warn' | 'fail'; summary: string }>;
  readinessWarnings: string[];
  readinessBlockers: string[];
}): string => {
  const passedChecks = checks.filter((check) => check.status === 'pass').length;
  const warningChecks = checks.filter((check) => check.status === 'warn').length;
  const failedChecks = checks.filter((check) => check.status === 'fail').length;
  const surfacedAttention = [...readinessWarnings, ...readinessBlockers].slice(0, 4);

  return `<section id="readiness" class="panel">
            <div class="section-head">
              <div>
                <h2>Readiness surface</h2>
                <p class="section-copy">Current readiness, closure posture, and blocking or warning signals from the Readiness projection.</p>
              </div>
            </div>
            <div class="story-grid">
              <article class="list-card">
                <h3>Signal summary</h3>
                <div class="inline-metrics">
                  <span><strong>${passedChecks}</strong> pass</span>
                  <span><strong>${warningChecks}</strong> warn</span>
                  <span><strong>${failedChecks}</strong> fail</span>
                  <span><strong>${readinessWarnings.length}</strong> Readiness warnings</span>
                </div>
                <div class="item-summary">This is the human-readable closure signal before you inspect the raw readiness artifacts.</div>
              </article>

              <article class="list-card">
                <h3>Attention</h3>
                <div class="rows">
                  ${
                    surfacedAttention.length > 0
                      ? surfacedAttention
                          .map(
                            (entry) => `<div class="item-row">
                              <div class="item-summary">${escapeHtml(entry)}</div>
                            </div>`,
                          )
                          .join('\n')
                      : '<div class="item-row"><div class="item-summary">No unresolved Readiness warnings or active readinessBlockers in the current Readiness snapshot.</div></div>'
                  }
                </div>
              </article>
            </div>
            <details class="disclosure" open>
              <summary>Detailed readiness checks</summary>
              <table>
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Status</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  ${checks
                    .map(
                      (check) => `<tr>
                        <td><code>${escapeHtml(check.id)}</code></td>
                        <td><span class="status ${escapeHtml(check.status)}">${escapeHtml(check.status)}</span></td>
                        <td>${escapeHtml(check.summary)}</td>
                      </tr>`,
                    )
                    .join('\n')}
                </tbody>
              </table>
            </details>
          </section>`;
};

const renderActivitySection = (
  activityViews: Awaited<ReturnType<typeof loadSkoposUiActivityViews>>,
): string => `<section id="activity" class="panel">
      <div class="section-head">
        <div>
          <h2>Activity</h2>
          <p class="section-copy">Recent plans, task ownership, action evidence, and lifecycle operations.</p>
        </div>
      </div>
      <div class="story-grid">
        <article class="list-card">
          <h3>Recent plans</h3>
          <div class="rows">
            ${
              activityViews.plans.length > 0
                ? activityViews.plans
                    .map(
                      (plan) => `<div class="item-row">
                        <div class="item-title-line">
                          <div class="item-title">${escapeHtml(plan.title)}</div>
                          ${plan.updatedAt ? `<div class="item-time">${escapeHtml(plan.updatedAt)}</div>` : ''}
                        </div>
                        <div class="item-meta">${escapeHtml(plan.scopeId)} · ${escapeHtml(plan.confidence)}${plan.createdByActorId ? ` · planned by ${escapeHtml(plan.createdByActorId)}` : ''}</div>
                        <div class="item-summary">${escapeHtml(plan.goal)}</div>
                      </div>`,
                    )
                    .join('\n')
                : '<div class="item-row"><div class="item-summary">No persisted plans yet.</div></div>'
            }
          </div>
        </article>

        <article class="list-card">
          <h3>Recent tasks</h3>
          <div class="rows">
            ${
              activityViews.tasks.length > 0
                ? activityViews.tasks
                    .map(
                      (task) => `<div class="item-row">
                        <div class="item-title-line">
                          <div class="item-title">${escapeHtml(task.title)}</div>
                          <span class="status ${escapeHtml(mapTaskStateToStatus(task.state))}">${escapeHtml(task.state)}</span>
                        </div>
                        <div class="item-meta">${task.pendingStepCount} pending${task.childTaskCount > 0 ? ` · ${task.childTaskCount} slice${task.childTaskCount === 1 ? '' : 's'}` : ''}${task.claimedByActorId ? ` · claimed by: ${escapeHtml(task.claimedByActorId)}` : ''}</div>
                        <div class="item-summary">${escapeHtml(task.summary)}</div>
                        ${
                          task.parentTaskId || task.lastUpdatedByActorId
                            ? `<div class="item-meta">${task.parentTaskId ? `parent: ${escapeHtml(task.parentTaskId)}` : ''}${task.lastUpdatedByActorId ? `${task.parentTaskId ? ' · ' : ''}updated by: ${escapeHtml(task.lastUpdatedByActorId)}` : ''}</div>`
                            : ''
                        }
                      </div>`,
                    )
                    .join('\n')
                : '<div class="item-row"><div class="item-summary">No persisted tasks yet.</div></div>'
            }
          </div>
        </article>

        <article class="list-card">
          <h3>Action evidence</h3>
          <div class="rows">
            ${
              activityViews.actionRuns.length > 0
                ? activityViews.actionRuns
                    .map(
                      (run) => `<div class="item-row">
                        <div class="item-title-line">
                          <div class="item-title">${escapeHtml(run.actionTitle)}</div>
                          <span class="status ${escapeHtml(mapActionStatusToStatus(run.runStatus))}">${escapeHtml(run.runStatus)}</span>
                        </div>
                        <div class="item-meta"><code>${escapeHtml(run.actionId)}</code>${run.runByActorId ? ` · run by: ${escapeHtml(run.runByActorId)}` : ''}</div>
                        <div class="item-summary">${run.outputPaths.length > 0 ? escapeHtml(run.outputPaths.join(', ')) : 'No output paths recorded.'}</div>
                      </div>`,
                    )
                    .join('\n')
                : '<div class="item-row"><div class="item-summary">No action runs recorded yet.</div></div>'
            }
          </div>
        </article>

        <article class="list-card">
          <h3>Operations</h3>
          <div class="rows">
            ${
              activityViews.operationalEvents.length > 0
                ? activityViews.operationalEvents
                    .map(
                      (event) => `<div class="item-row">
                        <div class="item-title-line">
                          <div class="item-title">${escapeHtml(event.eventKind)}</div>
                          <div class="item-time">${escapeHtml(event.timestamp)}</div>
                        </div>
                        <div class="item-meta">${escapeHtml(event.status)}${event.actorId ? ` · actor: ${escapeHtml(event.actorId)}` : ''}</div>
                        <div class="item-summary">${escapeHtml(event.summary)}</div>
                      </div>`,
                    )
                    .join('\n')
                : '<div class="item-row"><div class="item-summary">No operational log entries yet.</div></div>'
            }
          </div>
        </article>
      </div>
    </section>`;

interface RenderOperationalModulesOptions {
  outputPath: string;
  graphPortalPath: string;
  graphViews: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>;
}

const renderOperationalModules = ({
  outputPath,
  graphPortalPath,
  graphViews,
}: RenderOperationalModulesOptions): string => {
  const docsGraph = graphViews.graphs.find((graph) => graph.kind === 'docs');
  const commandsGraph = graphViews.graphs.find((graph) => graph.kind === 'commands');
  const scopeRelationsGraph = graphViews.graphs.find((graph) => graph.kind === 'scope-relations');

  if (!docsGraph && !commandsGraph && !scopeRelationsGraph) {
    return '';
  }

  return `<section id="operations" class="panel">
            <div class="section-head">
              <div>
                <h2>Operational surfaces</h2>
                <p class="section-copy">Curated graph-backed views for docs, commands, and scope relationships.</p>
              </div>
            </div>
            <div class="module-grid">
              ${docsGraph ? renderOperationalModuleCard(outputPath, graphPortalPath, docsGraph, 'Docs Surface') : ''}
              ${commandsGraph ? renderOperationalModuleCard(outputPath, graphPortalPath, commandsGraph, 'Command Surface') : ''}
              ${scopeRelationsGraph ? renderOperationalModuleCard(outputPath, graphPortalPath, scopeRelationsGraph, 'Scope Relations') : ''}
            </div>
          </section>`;
};

const renderOperationalModuleCard = (
  outputPath: string,
  graphPortalPath: string,
  graph: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>['graphs'][number],
  heading: string,
): string => {
  const highlightItems = graph.highlights
    .flatMap((group) => group.items.map((item) => `${group.title}: ${item}`))
    .slice(0, 6);

  return `<article class="module-card">
              <h3>${escapeHtml(heading)}</h3>
              <div class="surface-meta">
                <div class="subtle-label">Focus</div>
                <div class="item-title">${escapeHtml(graph.focusLabel)}</div>
              </div>
              <p class="muted">${escapeHtml(graph.summary || `${graph.nodeCount} nodes and ${graph.edgeCount} edges.`)}</p>
              <div class="inline-metrics">
                <span><strong>${graph.nodeCount}</strong> nodes</span>
                <span><strong>${graph.edgeCount}</strong> edges</span>
              </div>
              ${
                highlightItems.length > 0
                  ? `<div class="highlight-pill-list">${highlightItems
                      .map((item) => `<span class="highlight-pill">${escapeHtml(item)}</span>`)
                      .join('')}</div>`
                  : '<p class="muted">No highlighted relationships yet.</p>'
              }
              <details class="disclosure">
                <summary>Graph artifact</summary>
                <div class="disclosure-block">
                  <code>${escapeHtml(graph.artifactPath)}</code>
                </div>
              </details>
              <p><a href="${escapeHtml(toRelativeLink(outputPath, graphPortalPath))}">Inspect graph details</a></p>
            </article>`;
};

const mapTaskStateToStatus = (
  state: Awaited<ReturnType<typeof loadSkoposUiActivityViews>>['tasks'][number]['state'],
): 'pass' | 'warn' | 'fail' => {
  if (state === 'complete') {
    return 'pass';
  }

  if (state === 'blocked') {
    return 'fail';
  }

  return 'warn';
};

const mapActionStatusToStatus = (
  status: Awaited<ReturnType<typeof loadSkoposUiActivityViews>>['actionRuns'][number]['runStatus'],
): 'pass' | 'warn' | 'fail' => {
  if (status === 'succeeded') {
    return 'pass';
  }

  if (status === 'dry-run') {
    return 'warn';
  }

  return 'fail';
};

const renderGraphCard = (
  graph: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>['graphs'][number],
): string => `
  <article class="graph-card">
    <div class="graph-head">
      <div class="graph-kind">${escapeHtml(graph.kind)}</div>
      <h2>${escapeHtml(graph.title)}</h2>
      <p>${escapeHtml(graph.summary)}</p>
      <div class="meta">
        <span><strong>Focus:</strong> ${escapeHtml(graph.focusLabel)}</span>
        <span><strong>Nodes:</strong> ${graph.nodeCount}</span>
        <span><strong>Edges:</strong> ${graph.edgeCount}</span>
      </div>
      <div class="artifact">Artifact: <code>${escapeHtml(graph.artifactPath)}</code></div>
    </div>
    <div class="graph-grid">
      <section class="graph-section">
        <h3>Highlights</h3>
        <div class="highlight-groups">
          ${graph.highlights
            .map(
              (group) => `
            <div class="highlight-group">
              <h3>${escapeHtml(group.title)}</h3>
              <ul>
                ${group.items.length > 0 ? group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('') : '<li>No highlighted items.</li>'}
              </ul>
            </div>`,
            )
            .join('\n')}
        </div>
      </section>
      <section class="graph-section">
        <h3>Nodes</h3>
        ${renderNodeTable(graph.nodes)}
        <h3 style="margin-top: 18px;">Edges</h3>
        ${renderEdgeTable(graph.edges)}
      </section>
    </div>
  </article>`;

const renderNodeTable = (
  nodes: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>['graphs'][number]['nodes'],
): string => `
  <table>
    <thead>
      <tr>
        <th>Label</th>
        <th>Kind</th>
        <th>State</th>
      </tr>
    </thead>
    <tbody>
      ${nodes
        .slice(0, 12)
        .map(
          (node) => `
        <tr>
          <td>${escapeHtml(node.label)}${node.path ? `<div><code>${escapeHtml(node.path)}</code></div>` : ''}</td>
          <td>${escapeHtml(node.kind)}</td>
          <td><span class="state ${escapeHtml(node.state)}">${escapeHtml(node.state)}</span></td>
        </tr>`,
        )
        .join('\n')}
    </tbody>
  </table>`;

const renderEdgeTable = (
  edges: Awaited<ReturnType<typeof loadSkoposUiGraphViews>>['graphs'][number]['edges'],
): string => `
  <table>
    <thead>
      <tr>
        <th>From</th>
        <th>Relation</th>
        <th>To</th>
      </tr>
    </thead>
    <tbody>
      ${edges
        .slice(0, 12)
        .map(
          (edge) => `
        <tr>
          <td><code>${escapeHtml(edge.from)}</code></td>
          <td>${escapeHtml(edge.kind)}</td>
          <td><code>${escapeHtml(edge.to)}</code></td>
        </tr>`,
        )
        .join('\n')}
    </tbody>
  </table>`;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
