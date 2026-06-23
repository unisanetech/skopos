interface OrderListItem {
  id: string;
  total: string;
}

export function OrderList({ orders }: { orders: OrderListItem[] }) {
  return orders.map((order) => `${order.id}: ${order.total}`).join('
');
}
