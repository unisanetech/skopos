from features.billing.service import create_invoice
from features.orders.service import create_order

ROUTES = {"orders": create_order, "billing": create_invoice}
