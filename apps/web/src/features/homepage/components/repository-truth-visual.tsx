export function RepositoryTruthVisual() {
  return (
    <svg
      className="repository-truth-visual"
      xmlns="http://www.w3.org/2000/svg"
      width="1000"
      height="750"
      viewBox="0 0 1000 750"
      role="img"
      aria-labelledby="repository-truth-title repository-truth-description"
    >
      <title id="repository-truth-title">Project truth stays with the repository</title>
      <desc id="repository-truth-description">
        Memory, Task, Policy, and Evidence flow into a durable stack of project truth stored inside the repository.
      </desc>

      <defs>
        <marker id="repository-truth-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1.25 7 4 1 6.75Z" fill="#222222" />
        </marker>
        <style>{`
          .repository-truth-visual .paper { fill: #fbfaf7; stroke: #222; stroke-width: 1.55; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .ink { fill: none; stroke: #222; stroke-width: 1.45; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .fine { fill: none; stroke: #8a8883; stroke-width: 1; stroke-linecap: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .flow { fill: none; stroke: #222; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4 5; marker-end: url(#repository-truth-arrow); vector-effect: non-scaling-stroke; }
          .repository-truth-visual .heading { fill: #222; font-family: var(--font-geist-sans), "Arial Narrow", sans-serif; font-size: 17px; font-weight: 500; letter-spacing: .25px; }
          .repository-truth-visual .plane-label { fill: #222; font-family: var(--font-geist-sans), "Arial Narrow", sans-serif; font-size: 17px; font-weight: 600; letter-spacing: .4px; }
          .repository-truth-visual .face-label { fill: #222; font-family: var(--font-geist-sans), "Arial Narrow", sans-serif; font-size: 20px; font-weight: 500; letter-spacing: .6px; }
          .repository-truth-visual .repository-well { fill: #e8e5df; stroke: #222; stroke-width: 1.35; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .repository-stack-top { fill: #fbfaf7; stroke: #222; stroke-width: 1.55; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .repository-stack-left { fill: #f3f1ec; stroke: #222; stroke-width: 1.4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
          .repository-truth-visual .repository-stack-right { fill: #f7f5f0; stroke: #222; stroke-width: 1.4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
        `}</style>
      </defs>

      <g className="repository-truth-flows">
        <path className="flow" d="M405 167H465V326" />
        <path className="flow" d="M548 200H520V320" />
        <path className="flow" d="M620 214V347" />
        <path className="flow" d="M264 321H382V374" />
        <path className="flow" d="M730 349H666V397" />
      </g>

      <g transform="translate(270 34)">
        <path className="paper" d="M0 0H108L135 27V180H0Z" />
        <path className="ink" d="M108 0V27H135" />
        <text className="heading" x="22" y="35">MEMORY</text>
        <path className="ink" d="M40 58C50 56 59 58 67.5 64V98C58 92 49 90 40 92ZM95 58C85 56 76 58 67.5 64V98C77 92 86 90 95 92Z" />
        <path className="ink" d="M36 63V100C49 98 59 101 67.5 106 76 101 86 98 99 100V63" />
        <path className="fine" d="M18 120H117" />
        <circle className="ink" cx="25" cy="141" r="4" />
        <path className="fine" d="M42 141H112" />
        <circle className="ink" cx="25" cy="162" r="4" />
        <path className="fine" d="M42 162H112" />
      </g>

      <g transform="translate(548 34)">
        <path className="paper" d="M0 0H120L147 27V180H0Z" />
        <path className="ink" d="M120 0V27H147" />
        <text className="heading" x="22" y="35">TASK</text>
        <circle className="ink" cx="74" cy="70" r="20" />
        <circle className="ink" cx="74" cy="70" r="8" />
        <path className="ink" d="M74 42V52M74 88V98M46 70H56M92 70H102" />
        <path className="fine" d="M18 111H129" />
        <path className="ink" d="M21 137C21 131 24 128 29 128S37 131 37 137V142H21ZM24 125C24 122 26 120 29 120S34 122 34 125 32 130 29 130 24 128 24 125Z" />
        <path className="fine" d="M49 135H118" />
        <rect className="ink" x="22" y="153" width="13" height="13" />
        <path className="fine" d="M49 159H118" />
        <path className="ink" d="M20 174V164M20 174H126M126 174V164" />
      </g>

      <g transform="translate(130 240)">
        <path className="paper" d="M0 0H102L128 26V172H0Z" />
        <path className="ink" d="M102 0V26H128" />
        <text className="heading" x="19" y="34">POLICY</text>
        <path className="ink" d="M64 52 84 60V77C84 91 76 102 64 108 52 102 44 91 44 77V60Z" />
        <path className="ink" d="m55 77 7 7 13-14" />
        <path className="fine" d="M17 119H111" />
        <path className="ink" d="M21 139H32V152H21ZM23 139V134C23 130 25 128 27 128S31 130 31 134V139" />
        <path className="fine" d="M46 145H106" />
        <rect className="ink" x="21" y="158" width="14" height="12" />
        <path className="ink" d="m26 161 5 3-5 3Z" />
        <path className="fine" d="M46 164H106" />
      </g>

      <g transform="translate(730 240)">
        <path className="paper" d="M0 0H110L136 26V190H0Z" />
        <path className="ink" d="M110 0V26H136" />
        <text className="heading" x="19" y="34">EVIDENCE</text>
        <circle className="ink" cx="68" cy="68" r="22" />
        <circle className="ink" cx="68" cy="68" r="16" />
        <path className="ink" d="m59 68 7 7 13-14" />
        <path className="fine" d="M18 101H119" />
        <rect className="ink" x="21" y="116" width="12" height="12" />
        <path className="fine" d="M47 122H111" />
        <path className="ink" d="M21 137H29L34 142V154H21ZM29 137V142H34" />
        <path className="fine" d="M47 145H111" />
        <path className="ink" d="M21 168 29 160M27 172 35 164M25 165C20 160 26 154 31 158M31 169C36 173 42 167 38 162" />
        <path className="fine" d="M47 168H111" />
      </g>

      <g>
        <path className="paper" d="M250 455 505 321 760 455 505 594Z" />
        <path className="paper" d="M250 455 505 594V714L250 575Z" />
        <path className="paper" d="M505 594 760 455V575L505 714Z" />
        <path className="repository-well" d="M287 455 505 341 723 455 505 573Z" />

        <g>
          <path className="repository-stack-top" d="M340 402 505 315 673 402 505 492Z" />
          <path className="repository-stack-left" d="M340 402 505 492V568L340 478Z" />
          <path className="repository-stack-right" d="M505 492 673 402V478L505 568Z" />

          <g className="fine">
            <path d="M340 410 505 500 673 410M340 417 505 507 673 417M340 424 505 514 673 424M340 431 505 521 673 431M340 438 505 528 673 438M340 445 505 535 673 445M340 452 505 542 673 452M340 459 505 549 673 459M340 466 505 556 673 466" />
          </g>

          <path className="paper" d="M340 394 505 307 673 394 505 484Z" />
          <path className="ink" d="m381 391 18-10 18 9-18 10Z" />
          <g className="fine">
            <path d="M421 377 480 346M435 386 494 354M449 394 508 363M397 405 472 365M412 414 487 374M427 422 502 382M442 430 517 391M457 438 532 399" />
          </g>
          <text className="plane-label" x="489" y="342" transform="rotate(27 489 342)">PROJECT TRUTH</text>
        </g>

        <text className="face-label" x="282" y="530" transform="rotate(28 282 530)">REPOSITORY</text>

        <g className="ink">
          <path d="M566 592V646L616 618 666 584" />
          <circle className="paper" cx="566" cy="646" r="8" />
          <circle className="paper" cx="616" cy="618" r="8" />
          <circle className="paper" cx="666" cy="584" r="8" />
        </g>
      </g>
    </svg>
  );
}
