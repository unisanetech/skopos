# Good Mid-App Fixture

This fixture describes the expected shape for `architecture.mid-app.good-product-app`.

Properties:

1. route composition lives under `src/app`
2. product behavior lives under `src/features/orders`
3. runtime API mechanics live under `src/platform/api`
4. shared money formatting lives under `src/support/formatting`
5. imports flow in one direction
6. generated or external boundaries would be named before use

The fixture is intentionally small. It proves ownership and direction, not framework behavior.
