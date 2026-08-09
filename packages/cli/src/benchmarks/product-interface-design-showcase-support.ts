export type ProductInterfaceShowcaseScenario = {
  id: string;
  title: string;
  archetype: string;
  taskPrompt: string;
  brandBrief: string;
  requiredBehaviors: string[];
  moduleIds: string[];
};

export type ProductInterfaceShowcaseCaseResult = {
  scenario: ProductInterfaceShowcaseScenario;
  summary: string;
  sourcePaths: string[];
  desktopScreenshotPath: string;
  mobileScreenshotPath: string;
  checks: {
    desktopHorizontalOverflow: boolean;
    mobileHorizontalOverflow: boolean;
    pageErrors: string[];
  };
};

export const selectFreshShowcaseScenarios = ({
  scenarios,
  usedScenarioIds,
  count,
  requestedScenarioIds = [],
  allowRepeat = false,
}: {
  scenarios: ProductInterfaceShowcaseScenario[];
  usedScenarioIds: ReadonlySet<string>;
  count: number;
  requestedScenarioIds?: string[];
  allowRepeat?: boolean;
}): ProductInterfaceShowcaseScenario[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error('Showcase count must be a positive integer.');
  const byId = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  if (byId.size !== scenarios.length) throw new Error('Showcase scenario IDs must be unique.');

  if (requestedScenarioIds.length > 0) {
    const uniqueRequested = [...new Set(requestedScenarioIds)];
    if (uniqueRequested.length !== requestedScenarioIds.length) throw new Error('Requested showcase scenario IDs must be unique.');
    return uniqueRequested.map((id) => {
      const scenario = byId.get(id);
      if (!scenario) throw new Error(`Unknown showcase scenario: ${id}.`);
      if (!allowRepeat && usedScenarioIds.has(id)) {
        throw new Error(`Showcase scenario ${id} already ran for this Skill identity. Choose a fresh scenario or pass --allow-repeat.`);
      }
      return scenario;
    });
  }

  const available = scenarios.filter((scenario) => allowRepeat || !usedScenarioIds.has(scenario.id));
  if (available.length < count) {
    throw new Error(
      `Only ${available.length} fresh showcase scenario(s) remain, but ${count} were requested. Add new scenarios, reduce --count, or explicitly pass --allow-repeat.`,
    );
  }
  return available.slice(0, count);
};

export const buildShowcaseWorkerPrompt = ({
  scenario,
  guidance,
}: {
  scenario: ProductInterfaceShowcaseScenario;
  guidance: Array<{ title: string; summary: string }>;
}): string => {
  const guidanceText = guidance.map((entry) => `## ${entry.title}\n${entry.summary}`).join('\n\n');
  return `Create a complete product interface in this deliberately minimal static project. Work only inside the current workspace. Do not inspect parent directories, install dependencies, access the network, or use external images, fonts, scripts, or stylesheets. Replace the minimal scaffold with authored HTML, CSS, and JavaScript. Preserve semantic HTML, keyboard usability, responsive behavior, and functional local interactions. Check the result locally. This is a fresh design showcase, not a paired evaluation; do not mention evaluation arms or scoring.\n\nInterface task:\n${scenario.taskPrompt}\n\nProduct and brand brief:\n${scenario.brandBrief}\n\nRequired behavior:\n${scenario.requiredBehaviors.map((behavior) => `- ${behavior}`).join('\n')}\n\nProduct Interface Design guidance:\n${guidanceText}\n\nReturn only the required JSON.`;
};

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export const renderShowcaseGallery = ({
  runId,
  packVersion,
  results,
}: {
  runId: string;
  packVersion: string;
  results: ProductInterfaceShowcaseCaseResult[];
}): string => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Product Interface Design showcase</title>
  <style>
    :root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#172033;background:#f4f5f7}*{box-sizing:border-box}body{margin:0}header{padding:32px clamp(20px,5vw,72px);background:#111827;color:white}header p{color:#cbd5e1;max-width:72ch}main{display:grid;gap:32px;padding:32px clamp(20px,5vw,72px)}article{background:white;border:1px solid #d9dee7;border-radius:12px;overflow:hidden}article>div{padding:22px}.meta{color:#667085}.checks{display:flex;flex-wrap:wrap;gap:8px}.check{padding:5px 9px;border-radius:999px;background:#ecfdf3;color:#067647}.check.fail{background:#fff1f0;color:#b42318}.renders{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,.31fr);gap:12px;padding:0 22px 22px}.renders figure{margin:0}.renders img{display:block;width:100%;border:1px solid #d9dee7}.renders figcaption{font-size:13px;color:#667085;margin-bottom:6px}@media(max-width:760px){.renders{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header><h1>Product Interface Design showcase</h1><p>Fresh candidate-only pages created from minimal scaffolds. This gallery demonstrates range and rendered quality; it is not paired efficacy or promotion Evidence.</p><small>${escapeHtml(runId)} · Skill ${escapeHtml(packVersion)}</small></header>
  <main>${results.map((result) => {
    const failures = result.checks.pageErrors.length > 0 || result.checks.desktopHorizontalOverflow || result.checks.mobileHorizontalOverflow;
    return `<article><div><p class="meta">${escapeHtml(result.scenario.archetype)}</p><h2>${escapeHtml(result.scenario.title)}</h2><p>${escapeHtml(result.scenario.taskPrompt)}</p><p>${escapeHtml(result.summary)}</p><div class="checks"><span class="check${failures ? ' fail' : ''}">${failures ? 'Needs inspection' : 'Basic render checks passed'}</span></div></div><div class="renders"><figure><figcaption>Desktop</figcaption><img src="${escapeHtml(result.desktopScreenshotPath)}" alt="${escapeHtml(result.scenario.title)} desktop render"></figure><figure><figcaption>Mobile</figcaption><img src="${escapeHtml(result.mobileScreenshotPath)}" alt="${escapeHtml(result.scenario.title)} mobile render"></figure></div></article>`;
  }).join('')}</main>
</body>
</html>\n`;
