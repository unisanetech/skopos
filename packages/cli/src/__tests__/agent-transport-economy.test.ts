import { describe, expect, it } from 'vitest';

import {
  renderAgentTransportEconomyBenchmark,
  runAgentTransportEconomyBenchmark,
} from '../benchmarks/agent-transport-economy.js';

describe('agent transport economy benchmark', () => {
  it('certifies the full p50 and p95 metric matrix against the declared baseline', () => {
    const report = runAgentTransportEconomyBenchmark();

    expect(report.surfaces).toHaveLength(8);
    expect(report.rows.map((row) => row.fixture)).toEqual(['p50', 'p95']);
    for (const row of report.rows) {
      expect(row.skoposContextBytes).toBeLessThan(row.plainContextBytes);
      expect(row.byteReductionPercent).toBeGreaterThan(50);
      expect(row.skoposToolCalls).toBeLessThan(row.plainToolCalls);
      expect(row.reusableRunLinks).toBe(row.collectionSize);
      expect(row.plainRepeatedExecutions).toBe(row.collectionSize);
      expect(row.skoposRepeatedExecutions).toBe(0);
      expect(row.compactSurfaceMaxBytes).toBeLessThan(row.compactBudgetBytes);
      expect(row.plainNextActionP50Ms).toBeGreaterThanOrEqual(0);
      expect(row.skoposNextActionP50Ms).toBeGreaterThanOrEqual(0);
    }
  });

  it('renders an attributable generated report with methodology and reproduction', () => {
    const markdown = renderAgentTransportEconomyBenchmark(
      runAgentTransportEconomyBenchmark(),
    );

    expect(markdown).toContain('authority: generated');
    expect(markdown).toContain('Plain next action p50/p95 ms');
    expect(markdown).toContain('pnpm benchmark:transport');
    expect(markdown).toContain('not model, process, or network latency claims');
  });
});
