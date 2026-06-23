function createApiClient() {
  return { get: async () => [] as Array<{ id: string; totalCents: number }> };
}

export async function OrderList() {
  const api = createApiClient();
  const orders = await api.get();
  return orders.map((order) => `${order.id}:${order.totalCents}`).join('
');
}
