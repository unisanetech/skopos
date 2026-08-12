import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ClosingSection, PageAction, PageFrame, PageHero, PageSection, SectionIntro, SummaryStrip, pageType } from "@/patterns/site/page-layout";
import { SiteShell } from "@/patterns/site/site-shell";
import { projectMemoryCopy } from "./content";

function MemorySystemVisual() {
  return (
    <div
      className="memory-system-visual"
      role="img"
      aria-label="Architecture, decisions, current work, and patterns form project Memory inside the repository"
    >
      <div className="memory-visual-orbit" aria-hidden="true" />
      {projectMemoryCopy.memoryFiles.map((file, index) => (
        <div key={file.label} className={`memory-visual-file memory-visual-file--${index + 1}`}>
          <span>{file.label}</span>
          <code>{file.path}</code>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </div>
      ))}
      <div className="memory-visual-core">
        <span>PROJECT</span>
        <strong>MEMORY</strong>
        <small>Repository-owned truth</small>
      </div>
    </div>
  );
}

function ContextBriefVisual() {
  return (
    <div className="context-brief-visual" aria-label="A focused context brief for a checkout recovery Task">
      <div className="context-brief-header">
        <span>Context brief</span>
        <code>T-7f3a91c2</code>
      </div>
      <div className="context-brief-grid">
        <div>
          <span>Scope</span>
          <strong>checkout</strong>
        </div>
        <div>
          <span>Task</span>
          <strong>Recover interrupted payment</strong>
        </div>
      </div>
      <div className="context-brief-list">
        <p>
          <Icon symbol="description" size="sm" />
          <span>
            <strong>Decision</strong>
            Payment finalization stays idempotent
          </span>
        </p>
        <p>
          <Icon symbol="account_tree" size="sm" />
          <span>
            <strong>Pattern</strong>
            Recovery follows the existing checkout boundary
          </span>
        </p>
        <p>
          <Icon symbol="fact_check" size="sm" />
          <span>
            <strong>Required proof</strong>
            Focused recovery tests and typecheck
          </span>
        </p>
      </div>
      <footer>
        <span>Relevant now</span>
        <strong>3 records</strong>
      </footer>
    </div>
  );
}

export function ProjectMemoryScreen() {
  return (
    <SiteShell>
      <article className="bg-[var(--skopos-paper)]">
        <header><PageHero visual={<MemorySystemVisual />}>
              <h1 className={pageType.hero}>{projectMemoryCopy.title}</h1>
              <p className="mt-8 max-w-[680px] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.65] text-[var(--skopos-muted)]">{projectMemoryCopy.description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex min-h-[52px] items-center justify-between gap-7 border border-[var(--skopos-ink)] bg-[var(--skopos-ink)] px-[18px] text-[13px] font-bold text-white" href="#adopt-project">
                  Add Skopos to an existing project
                  <Icon symbol="arrow_downward" size="sm" />
                </a>
                <PageAction href="/how-it-works">See the working loop</PageAction>
              </div>
        </PageHero></header>
        <SummaryStrip items={projectMemoryCopy.memoryTypes} />

        <PageSection aria-labelledby="memory-alternatives-title"><PageFrame>
            <SectionIntro number="01" id="memory-alternatives-title" title="More than an instructions file." description="Every familiar tool preserves one useful part of the project. Skopos connects those parts to the work that is happening now." />
            <div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-2 xl:grid-cols-4">
              {projectMemoryCopy.alternatives.map((item) => (
                <article key={item.label} className="border-b border-r border-[var(--skopos-rule-light)] p-[var(--page-gutter)] md:p-8 xl:border-b-0">
                  <span className={cn(pageType.label,"text-[#777]")}>{item.label}</span>
                  <h3 className={cn(pageType.card,"mt-8")}>{item.strength}</h3>
                  <p className="mt-4 leading-[1.6] text-[var(--skopos-muted)]">{item.limit}</p>
                </article>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-7 text-sm md:px-8">
              <span className={cn(pageType.label,"mr-auto text-[#777]")}>Skopos connects</span>
              <strong>Knowledge</strong>
              <Icon symbol="arrow_forward" size="sm" />
              <strong>Current intent</strong>
              <Icon symbol="arrow_forward" size="sm" />
              <strong>Project checks</strong>
              <Icon symbol="arrow_forward" size="sm" />
              <strong>Fresh proof</strong>
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="memory-owned-title"><PageFrame className="grid min-[960px]:grid-cols-2"><div className="px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:px-[clamp(38px,5vw,68px)]"><span className="font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-light tracking-[-0.07em] text-[#b8b5ae]">02</span><h2 id="memory-owned-title" className={cn(pageType.section,"mt-10")}>Memory that belongs to the repository.</h2><p className="mt-6 leading-[1.65] text-[var(--skopos-muted)]">
                Durable truth stays in tracked, human-readable files. Your team can review it in a pull request, version it with the code, and carry it to another supported agent.
              </p>
              <dl className="mt-9 border-t border-[var(--skopos-rule-light)]">
                <div className="border-b border-[var(--skopos-rule-light)] py-5"><dt className="font-bold">Tracked truth</dt><dd className="mt-2 leading-[1.55] text-[var(--skopos-muted)]">Decisions, Plans, Patterns, Tasks, and other durable Memory live under the project’s declared Memory roots.</dd>
                </div>
                <div className="py-5"><dt className="font-bold">Disposable local state</dt><dd className="mt-2 leading-[1.55] text-[var(--skopos-muted)]">Indexes, caches, and runtime projections can be rebuilt. Deleting them does not delete the project’s durable knowledge.</dd>
                </div>
              </dl>
            </div><div className="memory-tree" aria-label="Example repository Memory tree">
              <div className="memory-tree-header">
                <Icon symbol="folder_open" size="sm" />
                <strong>your-project/</strong>
                <span>tracked</span>
              </div>
              <pre>{`docs/
├── architecture/
├── decisions/
├── domains/
├── patterns/
├── scopes/
│   └── storefront/
│       ├── overview.md
│       └── work/tasks/
└── work/plans/`}</pre>
              <div className="memory-tree-generated">
                <code>.skopos/</code>
                <span>generated · rebuildable</span>
              </div>
            </div>
          </PageFrame></PageSection>

        <PageSection aria-labelledby="memory-relevant-title"><PageFrame className="grid min-[960px]:grid-cols-2"><div className="px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:px-[clamp(38px,5vw,68px)]"><span className="font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-light tracking-[-0.07em] text-[#b8b5ae]">03</span><h2 id="memory-relevant-title" className={cn(pageType.section,"mt-10")}>Only the context this work needs.</h2><p className="mt-6 leading-[1.65] text-[var(--skopos-muted)]">
                Skopos uses the current Scope and Task to assemble a compact working brief. It includes relevant inherited truth and current intent without pretending every document is equally useful.
              </p>
              <ul className="mt-8 grid list-none gap-3 p-0 text-sm"><li className="flex gap-3"><Icon symbol="check" size="sm" /> Project-wide truth that applies everywhere</li><li className="flex gap-3"><Icon symbol="check" size="sm" /> Local truth owned by the affected Scope</li><li className="flex gap-3"><Icon symbol="check" size="sm" /> Task acceptance, boundaries, and remaining proof</li>
              </ul>
            </div><div className="flex items-center border-t border-[var(--skopos-rule-light)] p-[var(--page-gutter)] min-[960px]:border-t-0 min-[960px]:border-l min-[960px]:p-[clamp(38px,5vw,68px)]"><ContextBriefVisual /></div></PageFrame></PageSection>

        <PageSection className="bg-[var(--skopos-night)] text-white" aria-labelledby="memory-lifecycle-title"><PageFrame dark>
            <SectionIntro number="04" id="memory-lifecycle-title" title="Updated when project truth changes." description="Skopos does not silently rewrite documentation after every edit. Before a Task closes, durable impact is reviewed and resolved explicitly." dark />
            <div className="grid border-t border-[var(--skopos-rule-dark)] md:grid-cols-2 xl:grid-cols-4">
              <article className="border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:p-8 xl:border-b-0"><span className="font-mono text-xs text-[#777]">01</span>
                <Icon symbol="code" size="md" />
                <h3 className={cn(pageType.card,"mt-8")}>Work changes the project</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">The agent implements the bounded Task and gathers fresh Evidence.</p>
              </article>
              <article className="border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:p-8 xl:border-b-0"><span className="font-mono text-xs text-[#777]">02</span>
                <Icon symbol="manage_search" size="md" />
                <h3 className={cn(pageType.card,"mt-8")}>Durable impact is reviewed</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">Skopos identifies the Memory role that may need attention and requires an explicit review.</p>
              </article>
              <article className="border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:p-8 xl:border-b-0"><span className="font-mono text-xs text-[#777]">03A</span>
                <Icon symbol="edit_note" size="md" />
                <h3 className={cn(pageType.card,"mt-8")}>Memory updated</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">A canonical tracked document is updated because the project’s durable truth changed.</p>
              </article>
              <article className="border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:p-8 xl:border-b-0"><span className="font-mono text-xs text-[#777]">03B</span>
                <Icon symbol="done_all" size="md" />
                <h3 className={cn(pageType.card,"mt-8")}>Reviewed—no change</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">The existing truth remains sufficient, and the reason is recorded instead of manufacturing documentation churn.</p>
              </article>
            </div></PageFrame></PageSection>

        <PageSection id="adopt-project" aria-labelledby="memory-adoption-title"><PageFrame className="grid min-[960px]:grid-cols-2"><div className="px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:px-[clamp(38px,5vw,68px)]"><span className="font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-light tracking-[-0.07em] text-[#b8b5ae]">05</span><h2 id="memory-adoption-title" className={cn(pageType.section,"mt-10")}>Bring the project you already have.</h2><p className="mt-6 leading-[1.65] text-[var(--skopos-muted)]">
                Skopos first discovers the repository and proposes how its existing knowledge should fit the Memory standard. Material documentation changes wait for approval.
              </p>
              <div className="mt-8 flex flex-wrap gap-2" aria-label="Possible adoption operations">
                {projectMemoryCopy.adoptionOperations.map((operation) => (
                  <span className="border border-[var(--skopos-rule-light)] px-3 py-2 font-mono text-[10px] uppercase" key={operation}>{operation}</span>
                ))}
              </div>
            </div><ol className="grid list-none border-t border-[var(--skopos-rule-light)] p-0 min-[960px]:border-t-0 min-[960px]:border-l">
              <li className="grid grid-cols-[42px_1fr] border-b border-[var(--skopos-rule-light)] p-6"><span className="font-mono text-xs text-[#777]">01</span><div><strong>Discover</strong><p className="mt-2 text-sm leading-[1.55] text-[var(--skopos-muted)]">Read the repository, docs, commands, and declared project boundaries.</p></div></li>
              <li className="grid grid-cols-[42px_1fr] border-b border-[var(--skopos-rule-light)] p-6"><span className="font-mono text-xs text-[#777]">02</span><div><strong>Propose</strong><p className="mt-2 text-sm leading-[1.55] text-[var(--skopos-muted)]">Show exactly what stays, moves, merges, splits, rewrites, archives, or disappears.</p></div></li>
              <li className="grid grid-cols-[42px_1fr] border-b border-[var(--skopos-rule-light)] p-6"><span className="font-mono text-xs text-[#777]">03</span><div><strong>Approve</strong><p className="mt-2 text-sm leading-[1.55] text-[var(--skopos-muted)]">A developer reviews material restructuring before Skopos changes human-authored Memory.</p></div></li>
              <li className="grid grid-cols-[42px_1fr] p-6"><span className="font-mono text-xs text-[#777]">04</span><div><strong>Verify and activate</strong><p className="mt-2 text-sm leading-[1.55] text-[var(--skopos-muted)]">Confirm the adopted Memory is coherent and reconstructable before agents rely on it.</p></div></li>
            </ol>
          </PageFrame></PageSection>

        <PageSection aria-labelledby="memory-comparison-title"><PageFrame><SectionIntro number="06" id="memory-comparison-title" title="What changes when Memory becomes part of the project." /><div className="overflow-x-auto border-t border-[var(--skopos-rule-light)]" tabIndex={0}><table className="w-full min-w-[900px] border-collapse text-left text-sm [&_td]:border-r [&_td]:border-b [&_td]:border-[var(--skopos-rule-light)] [&_td]:p-5 [&_th]:border-r [&_th]:border-b [&_th]:border-[var(--skopos-rule-light)] [&_th]:p-5 [&_tr>*:last-child]:border-r-0">
                <thead>
                  <tr>
                    <th scope="col">Capability</th>
                    <th scope="col">Chat</th>
                    <th scope="col">Instructions</th>
                    <th scope="col">Private memory</th>
                    <th scope="col">Docs</th>
                    <th scope="col">Skopos</th>
                  </tr>
                </thead>
                <tbody>
                  {projectMemoryCopy.comparison.map((row) => (
                    <tr key={row.capability}>
                      <th scope="row">{row.capability}</th>
                      <td>{row.chat}</td>
                      <td>{row.instructions}</td>
                      <td>{row.privateMemory}</td>
                      <td>{row.docs}</td>
                      <td><strong>{row.skopos}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></PageFrame></PageSection>

        <ClosingSection title="Let the next agent start with the project—not an empty chat." description="Adopt Skopos without overwriting the truth your repository already contains."><PageAction href="/docs" primary light>Add Skopos to your project</PageAction><PageAction href="/how-it-works" light>See how the work continues</PageAction></ClosingSection>
      </article>
    </SiteShell>
  );
}
