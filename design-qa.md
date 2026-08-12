# Skopos Public Homepage Design QA

## Comparison Target

- Source visual truth, desktop:
  `/Users/bhaskarbarma/.codex/generated_images/019feb11-71c6-7543-a5a3-28f3c019172b/exec-79b9b977-b1b1-49d4-829a-81c374762be2.png`
- Source visual truth, mobile:
  `/Users/bhaskarbarma/.codex/generated_images/019feb11-71c6-7543-a5a3-28f3c019172b/exec-954497c1-2e2b-49af-94e6-17fe51824531.png`
- Rendered implementation: `http://127.0.0.1:4173/`
- Route and theme: `/`, initial checkout-recovery state, fixed editorial light/dark
  composition.
- Hero-refinement source captures:
  `apps/web/.artifacts/design-qa/sidebar-removal/desktop-monochrome.png` and
  `apps/web/.artifacts/design-qa/sidebar-removal/mobile-monochrome.png`. These are the
  immediately preceding approved hero at the same route and interaction state.
- Scoped user direction applied after the selected visual: remove the persistent
  marketing sidebar, align every section to one shared content frame, use black/white
  actions, and replace blue-slate dark surfaces with neutral near-black. Color remains
  only where it carries status or diagram meaning.

## Viewports And Normalization

- Desktop browser viewport requested: `1280 × 720` CSS pixels. The in-app browser
  content capture is `1269 × 714` pixels after browser insets. The `864 × 1821`
  full-page source concept was normalized to `1269` pixels wide for the comparison.
- Intermediate browser viewport requested: `900 × 780` CSS pixels. The application
  replaced the rail with the top header and reported no horizontal overflow.
- Mobile browser viewport requested: `390 × 844` CSS pixels. The in-app browser content
  capture is `379 × 820` pixels after browser insets. The `825 × 1906` full-page source
  concept was normalized to `379` pixels wide for the comparison.
- The source artifacts are full-page visual directions rather than pixel-accurate
  browser captures. Comparison therefore uses equal-width normalization plus focused
  same-state viewport captures instead of a misleading pixel overlay.

## Evidence

Full-view comparison inputs:

- `apps/web/.artifacts/design-qa/comparison-desktop.png`
- `apps/web/.artifacts/design-qa/comparison-mobile.png`

Focused rendered regions:

- `apps/web/.artifacts/design-qa/desktop-hero.png`
- `apps/web/.artifacts/design-qa/desktop-workflow.png`
- `apps/web/.artifacts/design-qa/desktop-boundary.png`
- `apps/web/.artifacts/design-qa/mobile-hero.png`
- `apps/web/.artifacts/design-qa/mobile-workflow.png`
- `apps/web/.artifacts/design-qa/mobile-promises.png`
- `apps/web/.artifacts/design-qa/mobile-boundary.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/desktop-monochrome.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/desktop-monochrome-workflow.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/mobile-monochrome.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/mobile-monochrome-workflow.png`
- `apps/web/.artifacts/design-qa/hero-refinement/after-desktop.png`
- `apps/web/.artifacts/design-qa/hero-refinement/after-small-laptop.png`
- `apps/web/.artifacts/design-qa/hero-refinement/after-compact.png`
- `apps/web/.artifacts/design-qa/hero-refinement/after-mobile.png`
- `apps/web/.artifacts/design-qa/hero-refinement/after-mobile-agent.png`

Scoped comparison inputs:

- `apps/web/.artifacts/design-qa/sidebar-removal/comparison-before-vs-after.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/comparison-color-before-after.png`
- `apps/web/.artifacts/design-qa/sidebar-removal/comparison-workflow-color-before-after.png`
- `apps/web/.artifacts/design-qa/hero-refinement/comparison-desktop-before-after.png`
- `apps/web/.artifacts/design-qa/hero-refinement/comparison-mobile-before-after.png`

Focused regions were required because the workstream labels, Evidence state, responsive
story bands, and closing product boundary are too small to judge reliably in the
normalized full-view comparison alone.

## Comparison History

### Pass 1 — blocked

- [P2] Desktop headline wrapped into four visually uneven lines.
  - Evidence: the initial desktop capture separated `Agents` from `change.`, while the
    source keeps the promise in three balanced lines.
  - Fix: reduced the wide display scale and preserved the tight line height in
    `src/app/globals.css`.
- [P2] The desktop boundary heading fragmented into an overly tall composition.
  - Evidence: auto-placement put the title alone in the second grid column and pushed
    its explanation underneath the index.
  - Fix: assigned explicit eyebrow, title, and description grid areas and reduced the
    boundary display scale.
- [P2] The mobile pre-release state was missing from the compact header.
  - Evidence: the source keeps release truth visible beside the menu, while the first
    mobile capture showed only the wordmark and menu.
  - Fix: made the status visible through the mobile range, retaining the hide rule only
    below `350px` where the three controls cannot fit safely.

### Pass 2 — passed

- Post-fix desktop hero preserves the source hierarchy: category, three-line promise,
  concise explanation, two actions, and repository-truth illustration.
- Post-fix workstream keeps the continuous dark product environment, four user-controlled
  stages, three-column desktop dossier, focused ledger, and mobile disclosure sequence.
- Post-fix story bands preserve the numbered light/dark rhythm and become intentionally
  taller on narrow screens so copy and controls remain readable.
- Post-fix desktop and mobile boundary views preserve the product distinction, paired
  `is` / `is not` model, and truthful pre-release action without clipping or overflow.

### Pass 3 — blocked by scoped homepage feedback

- [P2] The persistent desktop sidebar read as product-console navigation rather than a
  focused public homepage.
  - Evidence: `comparison-before-vs-after.png` shows the rail consuming the full page
    height and narrowing the main story even though the homepage has only one route.
  - Fix: replaced the rail with one sticky top navigation while preserving active
    section state, the compact mobile dialog, and the workflow CTA.
- [P2] Section content did not share one stable horizontal frame.
  - Evidence: the header, hero, workstream, story bands, boundary, and footer used
    different independent width and gutter values.
  - Fix: introduced one `1280px` content maximum and one responsive gutter, then added
    explicit inner frames while leaving light and dark section backgrounds full bleed.

### Pass 4 — blocked by scoped color feedback

- [P2] The blue primary CTA competed with the repository illustration and made the
  surface feel more generic than the intended editorial developer-product direction.
  - Evidence: `comparison-color-before-after.png` shows blue used for the main action,
    eyebrow, and active navigation at once.
  - Fix: made primary actions black on light backgrounds and white on dark backgrounds;
    active navigation and workflow selection are monochrome.
- [P2] The product environment used a visibly blue slate instead of a neutral dark.
  - Evidence: `comparison-workflow-color-before-after.png` shows the former navy cast
    beside the revised neutral `#050505` surface and gray structural borders.
  - Fix: neutralized dark surfaces, dividers, supporting copy, code labels, and mobile
    disclosures. Blue remains only as the small semantic signal and inside the supplied
    repository-truth illustration; amber and green remain blocker/success states.

### Pass 5 — passed

- The desktop rail is gone; the top navigation preserves the homepage hierarchy while
  giving the product story the full content frame.
- Header, hero, workstream, all three story bands, boundary, and footer measure to the
  same `1280px` frame at wide width and the same `24px` inset at `390px`.
- Primary actions render black-on-white or white-on-black according to their surface.
- Workstream and boundary backgrounds render at neutral `rgb(5, 5, 5)` with neutral
  gray borders and no navy/slate cast.

### Pass 6 — passed: hero onboarding refinement

- Replaced the generic hero CTA pair with one compact, copyable onboarding surface.
  The default tab presents the intended released npm package flow; the second tab gives
  a coding agent a guarded existing-project adoption brief and exact init, understand,
  and assess sequence.
- The visible release state now says `Available on npm` rather than contradicting the
  released-package installation model. The package identifier remains visible beside
  the tabs without competing with the headline.
- The desktop comparison preserves the approved three-line promise and repository-truth
  illustration while adding a darker, developer-native setup surface in the former CTA
  space. The mobile comparison intentionally moves more of the illustration below the
  first viewport so the installation path remains readable rather than miniaturized.
- Responsive verification covered `1280 × 800`, `1024 × 820`, `900 × 900`, `768 × 900`,
  `390 × 844`, and `320 × 720` requested CSS viewports. Browser content widths were
  respectively reduced by the in-app browser inset where applicable; every state
  reported no horizontal overflow. At `320px`, the hero content and onboarding panel
  both measured `261px` wide and the copy control remained fully inside the surface.
- The two tab controls are semantic tabs with labelled tab panels and visible focus.
  The copy action switched to its `Copied` confirmation state, and the agent tab exposed
  the full adoption brief without clipping.

## Required Fidelity Surfaces

- Fonts and typography: the system sans stack is a close, licensable optical match to
  the unidentified reference face. Display weight, tight tracking, line height, label
  casing, mono data, and responsive wrapping preserve the intended hierarchy.
- Spacing and layout rhythm: compact top navigation, split hero, continuous workstream,
  numbered bands, boundary model, and footer follow one shared maximum width and gutter.
  Intermediate and mobile layouts reflow rather than miniaturize the product UI.
- Hero refinement rhythm: the desktop hero fills one opening viewport, the `1024px`
  split remains balanced, and the layout becomes one readable column at `860px` and
  below. Headline line grouping stays intentional; the command surface wraps at narrow
  widths instead of truncating or creating page overflow.
- Colors and tokens: warm paper, true neutral black, white/black actions, gray structure,
  tiny cobalt signal, amber blocker, and green valid state form a restrained semantic
  hierarchy with readable contrast. No decorative gradients, glows, glass surfaces, or
  blue-slate dark panels remain.
- Image quality and asset fidelity: the hero uses a dedicated `1448 × 1086` generated
  raster asset grounded in both approved references. It keeps all five exact labels and
  has no crop, stretch, halo, inline SVG substitute, or CSS-art replacement.
- Copy and content: hero and story promises match the approved narrative. Workstream
  data remains truthful about cooperative coordination, Task closure, skipped broad
  checks, and project-owned Evidence.
- Hero onboarding copy models the intended npm release surface: install, initialize,
  recover Session context, or hand a guarded init/understand/adopt-assess brief to a
  coding agent. No source-checkout or pre-release caveat remains in the released view.
- Icons: all interface icons come from the app-local Unisane Icon component backed by
  Material Symbols; sizes, optical weight, and state colors are consistent.
- Accessibility and behavior: semantic landmarks and headings, skip link, labelled
  navigation, alt text, visible focus, `44px` targets, keyboard stage controls,
  user-controlled motion, reduced-motion support, status text beyond color, and mobile
  dialog semantics are present.

## Browser Verification

- Primary hero CTA navigated to `#workflow`.
- Mobile menu opened, moved focus to the first link, selected `05 Boundary`, closed, and
  navigated to `#boundary`.
- Mobile `Next` advanced through all four shared workstream states; the live region read
  `Stage 4 of 4: Explain Readiness`, the final state exposed `Ready to close`, and the
  final `Next` control was disabled.
- Wide, intermediate, and narrow layouts reported no horizontal page overflow.
- Browser warning/error log check returned zero entries.
- Re-verified after the navigation, shared-frame, and monochrome changes: desktop header
  CTA navigated to `#workflow`; stage 4 exposed `Ready to close`; the mobile menu opened,
  selected Boundary, closed, and navigated to `#boundary`; no runtime error surface or
  alert appeared and development-server requests completed without errors.
- Hero refinement: selected both onboarding tabs, confirmed the labelled panel content,
  activated the copy control and observed its `Copied` state, measured the hero at six
  responsive widths, and found no horizontal overflow. The final desktop and mobile
  captures show `Available on npm` and the npm package installation state.

## Findings

No actionable P0, P1, or P2 differences remain.

Residual P3 variation: the repository-truth raster retains its thin cobalt linework and
the npm-availability dot uses the same small signal color. This is intentional tertiary color,
not action styling; blocker and passing state colors remain semantic. The implementation
also gives mobile Evidence controls more vertical room than the compressed source frame.

The public release label now uses the same small cobalt signal dot; it carries status,
not action styling. On narrow mobile screens the illustration continues below the first
viewport by design so the npm commands and agent handoff remain legible.

## Implementation Checklist

- [x] Approved wide and narrow hierarchy implemented.
- [x] Hero artwork accounted for as a project-owned asset.
- [x] Four-stage workstream interactions verified.
- [x] Wide, intermediate, and narrow responsive states verified.
- [x] Focus, status, reduced motion, and semantic structure verified.
- [x] Focused typecheck, model tests, static production build, and console check passed.
- [x] Sidebar removed and desktop/mobile navigation behavior re-verified.
- [x] Shared section maximum width and responsive gutter measured across all sections.
- [x] Primary actions and dark surfaces converted to the approved monochrome hierarchy.
- [x] Hero CTA pair replaced with copyable npm and coding-agent onboarding states.
- [x] Hero checked at wide, small-laptop, tablet, compact, mobile, and narrow-mobile widths.

### Pass 7 — passed: editorial grid console

Source visual truth:

- `apps/web/.artifacts/audit/hero-premium/01-desktop-install.png`
- `apps/web/.artifacts/audit/hero-premium/03-mobile-install.png`
- The approved direction was the existing monochrome hero with a more deliberate
  structural frame and one physically unified onboarding console. The source captures
  are the last browser-rendered state before this refinement, not an unrelated concept.

Rendered implementation:

- `apps/web/.artifacts/design-qa/hero-grid/final-desktop-install.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/final-desktop-agent.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/final-mobile-install.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/final-mobile-agent.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/compact-desktop-install.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/tablet-install.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/narrow-install.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/narrow-agent.jpg`

Normalized comparison evidence:

- `apps/web/.artifacts/design-qa/hero-grid/comparison-desktop-before-after.jpg`
- `apps/web/.artifacts/design-qa/hero-grid/comparison-mobile-before-after.jpg`
- Desktop source and implementation are both `1269 × 793` pixels from a requested
  `1280 × 800` CSS viewport at device scale factor `1` after the in-app browser inset.
- Mobile source and implementation are both `379 × 820` pixels from a requested
  `390 × 844` CSS viewport at device scale factor `1` after the in-app browser inset.
- Focused comparisons were required for the attached tab header, copy target, command
  wrapping, fixed-height panel, footer, and narrow agent sequence; the paired desktop
  and mobile comparison inputs place the source and implementation in one image.

Findings and fixes:

- [P2] The former tabs and dark code panel read as separate stacked elements.
  The desktop and mobile comparison inputs show the new one-pixel outer console border,
  attached tab header, shared dark panel edge, and integrated repository-memory footer.
- [P2] The previous source and agent panels changed height by `38.2px` on desktop and
  `70.8px` on mobile. The final measured panel deltas are exactly `0px`; the complete
  hero frame delta is also exactly `0px` at desktop and `320px` narrow-mobile states.
- [P2] The hero lacked the structural separation requested for the premium developer-
  tooling direction. The final comparison shows one restrained outer frame with a copy
  cell, a real project-owned illustration cell, and a single divider. No graph paper,
  decorative grid, gradient, shadow stack, or extra card clutter was added.
- [P2] The copy action measured `36px` high in the first refinement capture. It now
  measures `44px` at desktop and mobile while remaining fully inside the fixed panel.

Required fidelity surfaces:

- Fonts and typography: the existing sans and mono families, tight display tracking,
  compact uppercase console labels, and responsive line groupings are preserved. No
  truncation occurs in the agent brief; commands wrap only where required at `320px`.
- Spacing and layout rhythm: the hero uses the shared page maximum, one outer border,
  two desktop cells, and one stacked tablet/mobile frame. Captures at requested widths
  `1280`, `1024`, `768`, `390`, and `320` show no horizontal overflow.
- Colors and tokens: paper, neutral black, warm gray dividers, and the existing small
  semantic blue signal remain. Tabs and controls are black/white according to surface;
  the dark panel is `#0b0b0b`, not blue slate.
- Image quality and asset fidelity: the existing `repository-truth.png` raster remains
  intact, centered, uncropped, and sharp. No inline SVG, CSS illustration, or placeholder
  asset replaced it.
- Copy and content: the released npm install flow is unchanged. The agent view now gives
  a concise guarded brief plus Initialize, Understand, and Assess steps; copying still
  supplies the full brief and exact commands.
- Accessibility and behavior: tabs implement roving keyboard focus; `End` selected and
  focused the agent tab, `Home` returned to the npm tab, and the copy button announced
  `Copied`. Tabs measure `46px` high and the copy target measures `44px` high.

Browser verification:

- Both onboarding states rendered at identical panel and hero-frame heights.
- Desktop, compact desktop, tablet, mobile, and `320px` narrow-mobile captures reported
  document width equal to browser content width with no horizontal overflow.
- Install commands and the agent sequence remained inside their fixed-height panels at
  the narrowest verified width.
- Keyboard `End` / `Home`, mouse tab selection, and the copy confirmation state passed.
- Browser development logs contained informational React/HMR entries and zero warnings
  or errors after the final render.

No actionable P0, P1, or P2 differences remain. The small blue npm-status dot and blue
linework inside the repository illustration remain intentional tertiary signals.

### Pass 8 — passed: frameless hero edge treatment

- Source state: `apps/web/.artifacts/design-qa/hero-grid/final-desktop-install.jpg`
  and `apps/web/.artifacts/design-qa/hero-grid/final-mobile-install.jpg`.
- Rendered implementation: `apps/web/.artifacts/design-qa/hero-frameless/desktop.jpg`
  and `apps/web/.artifacts/design-qa/hero-frameless/mobile.jpg`.
- Same-state comparison inputs: `apps/web/.artifacts/design-qa/hero-frameless/comparison-desktop.jpg`
  (`2550 × 793`) and `apps/web/.artifacts/design-qa/hero-frameless/comparison-mobile.jpg`
  (`770 × 820`). Each pair uses matching source and implementation viewports at
  device scale factor `1`.
- Removed the hero section's outer vertical padding at every responsive breakpoint and
  removed the enclosing `.hero-inner` border. Computed outer border width is `0px` and
  the hero begins immediately after the `73px` desktop / `69px` mobile header.
- Preserved the intentional internal divider: `1px` between copy and illustration on
  desktop and `1px` above the illustration in stacked mobile layout.
- Typography, copy, console geometry, real repository illustration, and monochrome color
  tokens are unchanged. No horizontal overflow or browser warnings/errors were found.
- No focused-region comparison beyond the paired full viewport was needed: the requested
  change affects only the clearly visible outer edge and vertical section spacing.

No actionable P0, P1, or P2 differences remain.

### Pass 9 — passed: retained side borders

- Rendered implementation: `apps/web/.artifacts/design-qa/hero-frameless/desktop-side-borders.jpg`
  and `apps/web/.artifacts/design-qa/hero-frameless/mobile-side-borders.jpg`.
- The hero remains vertically flush: computed top and bottom outer borders are `0px`
  and section block padding remains `0px`.
- The requested left and right frame edges are restored at `1px` on both desktop and
  mobile. The internal desktop split and stacked mobile illustration divider remain.
- Requested `1280 × 800` and `390 × 844` browser viewports reported no horizontal
  overflow, clipping, warnings, or errors. Typography, assets, copy, and interactions
  are unchanged, so no additional focused comparison was required.

No actionable P0, P1, or P2 differences remain.

### Pass 10 — passed: continuous homepage section rails

Source visual truth:

- `apps/web/.artifacts/design-qa/hero-frameless/desktop-side-borders.jpg`
- `apps/web/.artifacts/design-qa/hero-frameless/mobile-side-borders.jpg`
- The approved source pattern is the hero's flush `1px` left/right frame with no outer
  top or bottom border. This pass transfers that exact edge treatment to every content
  section rather than changing section content or hierarchy.

Rendered implementation:

- `apps/web/.artifacts/design-qa/section-rails/desktop-hero.jpg`
- `apps/web/.artifacts/design-qa/section-rails/desktop-workflow.jpg`
- `apps/web/.artifacts/design-qa/section-rails/desktop-promises.jpg`
- `apps/web/.artifacts/design-qa/section-rails/desktop-boundary.jpg`
- `apps/web/.artifacts/design-qa/section-rails/desktop-footer.jpg`
- `apps/web/.artifacts/design-qa/section-rails/mobile-hero.jpg`
- `apps/web/.artifacts/design-qa/section-rails/mobile-workflow.jpg`
- `apps/web/.artifacts/design-qa/section-rails/mobile-promises.jpg`
- `apps/web/.artifacts/design-qa/section-rails/mobile-boundary.jpg`

Combined pattern comparison inputs:

- `apps/web/.artifacts/design-qa/section-rails/comparison-desktop-rail-pattern.jpg`
  (`2550 × 1598` pixels)
- `apps/web/.artifacts/design-qa/section-rails/comparison-mobile-rail-pattern.jpg`
  (`770 × 1652` pixels)
- Desktop states use a requested `1280 × 800` CSS viewport and `1269 × 793` browser
  content captures. Mobile states use `390 × 844` CSS and `379 × 820` content captures,
  all at device scale factor `1`.
- This is a same-pattern transfer comparison rather than a misleading pixel overlay:
  the hero source occupies the first cell, with workflow, promise, and boundary frames
  shown beside it at the same rendered width and density.

Findings and fixes:

- [P2] The hero side rails stopped at the first section, so the page frame did not read
  as one system. Added matching rails to a new `workstream-inner` wrapper, each
  `promise-band-inner`, `boundary-inner`, and `site-footer-inner`.
- [P2] Applying borders directly to the previous separate workstream heading and demo
  would have created disconnected segments. One semantic wrapper now owns the complete
  workstream rail and its responsive inner padding.
- [P2] Section content would have touched a newly introduced rail at its first column.
  Section-owned responsive padding keeps the existing editorial rhythm inside the frame
  without changing full-bleed light/dark backgrounds.

Verification:

- At desktop, all seven measured frames share `left: 57.59375px`,
  `right: 1211.40625px`, and `width: 1153.8125px` with `1px` side borders.
- At mobile, all seven frames share `left: 0px`, `right: 379px`, and `width: 379px`
  with `1px` side borders.
- Hero, workstream, three promise bands, boundary, and footer align without doubled
  vertical lines or new top/bottom frame borders.
- Full-bleed section colors, typography, real imagery, icons, copy, and interactions are
  unchanged. No horizontal overflow, clipping, browser warning, or browser error remains.

No actionable P0, P1, or P2 differences remain.

### Pass 11 — passed: edge-to-edge horizontal dividers with padded content

Source visual truth:

- `apps/web/.artifacts/design-qa/section-rails/desktop-workflow.jpg`
- `apps/web/.artifacts/design-qa/section-rails/comparison-desktop-rail-pattern.jpg`
- The accepted vertical-rail system is the source; this pass completes the box-grid
  treatment by making section-level horizontal dividers meet the rails while preserving
  the existing content insets.

Rendered implementation:

- `apps/web/.artifacts/design-qa/horizontal-dividers/desktop-workflow-padded.jpg`
- `apps/web/.artifacts/design-qa/horizontal-dividers/desktop-boundary.jpg`
- `apps/web/.artifacts/design-qa/horizontal-dividers/desktop-footer.jpg`
- `apps/web/.artifacts/design-qa/horizontal-dividers/mobile-workflow-padded.jpg`
- `apps/web/.artifacts/design-qa/horizontal-dividers/mobile-boundary.jpg`
- `apps/web/.artifacts/design-qa/horizontal-dividers/mobile-bottom-dividers.jpg`

Combined comparison evidence:

- `apps/web/.artifacts/design-qa/horizontal-dividers/comparison-desktop-before-after.jpg`
  (`2550 × 793` pixels) shows the same workstream state before and after padding
  correction at a requested `1280 × 800` CSS viewport, device scale factor `1`.
- `apps/web/.artifacts/design-qa/horizontal-dividers/comparison-mobile-before-after.jpg`
  (`770 × 820` pixels) is responsive pattern evidence at `390 × 844` CSS. Its source
  crop is higher in the page than the implementation crop, so it is not used for
  pixel-position claims; mobile geometry is verified by browser measurements below.

Findings and fixes:

- [P2] Workstream stage and ledger separators stopped at the former content inset.
  The demo now expands to the inside edge of both rails, so its stage, column, card,
  ledger, and row dividers cover the full framed width.
- [P2] Expanding the demo initially brought workstream content too close to the rails.
  Desktop tabs, stage columns, and the Evidence ledger now share the `38.398px` rendered
  content inset; mobile controls, cards, and ledger content share a `24px` inset.
- [P2] Promise separators and the footer top edge were attached to full-bleed outer
  sections. They now belong to their framed inner wrappers and terminate precisely at
  the vertical rails.
- [P2] The boundary model divider was limited to the padded content column. Its border
  now spans the complete inner frame while the model content retains the section inset.

Measured geometry:

- Desktop workstream frame: `57.59375px → 1211.40625px`; horizontal demo and stage
  borders: `58.59375px → 1210.40625px`, meeting the inside edge of each `1px` rail.
- Desktop heading, first stage item, first stage column, and ledger heading all begin at
  `96.9921875px`, confirming one consistent content inset behind the full-width lines.
- Mobile frame: `0px → 379px`; horizontal demo/card/model borders:
  `1px → 378px`; heading, first disclosure, controls, and ledger content:
  `25px → 354px`.
- Promise-band bottom borders span the complete `1153.8125px` desktop frame and `379px`
  mobile frame. Boundary and footer dividers use the same endpoints.

Typography, colors, imagery, icons, copy, tab behavior, and workstream state behavior
are unchanged. Browser logs contain no warnings or errors, and no horizontal overflow
or clipping was found.

No actionable P0, P1, or P2 differences remain.

final result: passed

### Pass 14 — blocked: revised hero headline balance

Source visual truth:

- `/var/folders/5h/v4t5vlh146z2wcg11rdyxh400000gn/T/TemporaryItems/NSIRD_screencaptureui_bIJ3Zk/Screenshot 2026-08-11 at 3.01.20 AM.png`
- Source capture dimensions: `2048 × 1187` pixels. The visible state shows the selected
  hero copy at a wide desktop viewport with the installation tab active.

Implementation target:

- `http://127.0.0.1:4173/`
- The clean Next.js development preview is running and the intended state is the hero
  with `Your agents write the code. Skopos keeps the work coherent.` and the installation
  tab active.

Current finding:

- [P1] The prior rendered headline is too dominant and wraps into an uneven five-line
  block, which pushes the onboarding console down and underweights the illustration.
- A browser-rendered post-fix implementation screenshot is not available. The in-app
  browser rejected navigation and capture access to the local preview, and the only open
  local tabs currently expose the browser error surface rather than the homepage.
- Without a same-viewport implementation capture, typography, spacing, colors, image
  balance, copy wrapping, mobile behavior, console state, and focused hero comparison
  cannot be truthfully marked as verified.

Required continuation:

- Manually refresh the already-open local preview tab so it displays the homepage.
- Capture the refreshed wide hero and a mobile viewport from that claimed live tab.
- Compare the new captures with the source in one comparison input, apply any remaining
  P1/P2 fixes, and repeat until no actionable visual findings remain.

final result: blocked

### Pass 13 — blocked: grid-line continuity polish

Source visual truth:

- `apps/web/.artifacts/design-qa/grid-polish/01-reference.png`
- `apps/web/.artifacts/design-qa/grid-polish/02-reference.png`
- `apps/web/.artifacts/design-qa/grid-polish/03-reference.png`

Requested fixes implemented in `apps/web/src/app/globals.css`:

- Workstream tabs now have a full-width top rule and full-height vertical cell borders.
- Task and Readiness internal horizontal rules expand through the column padding so they
  meet the containing vertical borders while their text retains its original inset.
- Boundary-model content padding moved inside each grid cell so its vertical dividers
  span from the model's top rule to the parent section boundary.
- Responsive boundary padding was adjusted so tablet and mobile closing content retain
  intentional bottom breathing room.

Verification available:

- Type generation and TypeScript check pass.
- Five focused homepage tests pass.
- The static production build passes.

Blocking visual evidence gap:

- The local preview is running at the expected address, but the selected in-app browser
  rejected read and capture access to the local URL. Therefore a browser-rendered
  implementation screenshot, same-state comparison input, responsive geometry check,
  interaction check, and console check could not be captured in this run.
- Per the Product Design QA gate, source screenshots and code inspection alone cannot
  establish a visual pass. Refreshing the existing preview tab and resuming browser
  access is required before closure.

final result: blocked

### Pass 12 — passed: viewport-wide rules with contained content

Current-run reference evidence:

- `apps/web/.artifacts/reference/tailwind-borders/01-tailwind-desktop.png`
  captures Tailwind CSS at desktop size. The useful pattern is separation of concerns:
  full-bleed row rules establish page rhythm while text and interactive content stay
  inside a centered content rail.
- `apps/web/.artifacts/reference/tailwind-borders/02-skopos-before-desktop.png`
  and `03-skopos-before-full.png` capture the Skopos state before this correction.
  Existing horizontal rules stopped at the max-width side rails.

Rendered implementation:

- `apps/web/.artifacts/reference/tailwind-borders/04-skopos-after-desktop.png`
- `apps/web/.artifacts/reference/tailwind-borders/05-skopos-boundary-desktop.png`
- `apps/web/.artifacts/reference/tailwind-borders/06-skopos-workflow-mobile.png`
- `apps/web/.artifacts/reference/tailwind-borders/07-skopos-promises-mobile.png`

Findings and fixes:

- [P2] Section and internal-row rules were visually attached to the `1280px` content
  frame, so on wider displays they read as component borders rather than page-level
  structure. Workstream boundaries, stage rows, promise transitions, the boundary
  model split, and the footer boundary now span the full viewport.
- [P2] Widening the content boxes themselves would have broken the consistent reading
  width. The existing centered max-width wrappers and vertical rails remain unchanged;
  only the horizontal rule layer is full-bleed.
- [P2] Viewport-width pseudo-elements can create an accidental horizontal scrollbar.
  They are centered from the owning row and clipped by the existing site shell. Browser
  measurements report equal document `scrollWidth` and `clientWidth` at mobile size.

Responsive result:

- Desktop preserves the shared content rail and its existing responsive padding while
  horizontal rules continue to both viewport edges.
- Mobile retains `24px` content insets; section transitions and workstream row rules
  span the available screen width without clipping or layout shift.
- Typography, colors, imagery, copy, interactions, and semantic section structure are
  unchanged. Screenshot evidence cannot establish full accessibility compliance, so
  keyboard behavior, focus visibility, and programmatic semantics remain covered by the
  existing implementation tests rather than this visual pass alone.

No actionable P0, P1, or P2 differences remain.

final result: passed
