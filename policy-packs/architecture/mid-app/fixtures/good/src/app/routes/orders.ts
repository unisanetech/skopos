import { listOrdersView } from '../../features/orders/index.js';

export async function ordersRoute() {
  return listOrdersView();
}
