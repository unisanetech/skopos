import { getJson } from '../../platform/api/client.js';
import { formatMoney } from '../../support/formatting/money.js';

interface OrderRecord {
  id: string;
  totalCents: number;
}

export async function listOrdersView() {
  const orders = await getJson<OrderRecord[]>('/orders');
  return orders.map((order) => ({
    id: order.id,
    total: formatMoney(order.totalCents),
  }));
}
