export function orderTotalLabel(totalCents: number): string {
  return `Order total: $${(totalCents / 100).toFixed(2)}`;
}

export function randomId(): string {
  return Math.random().toString(36).slice(2);
}
