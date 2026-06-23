# Mid-App Examples

## Metadata

- Pack ID: `architecture.mid-app`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/architecture/mid-app/examples`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `../fixtures/good/README.md`
  - `../fixtures/drift/README.md`

## Good Shape

```text
src/
  app/routes/orders.ts
  features/orders/index.ts
  features/orders/service.ts
  features/orders/components/order-list.tsx
  platform/api/client.ts
  support/formatting/money.ts
```

Why it works:

1. app route composes the feature
2. feature owns order behavior and UI
3. platform owns API mechanics
4. support owns stable formatting
5. imports flow inward from app to feature to platform/support

## Drift Shape

```text
src/
  shared/helpers.ts
  features/orders/components/order-list.tsx
  features/billing/service.ts
```

Problems:

1. `shared/helpers.ts` hides order-specific business behavior
2. billing imports an order component internal instead of a public surface
3. runtime API calls are created directly in feature UI
4. no documented validation lane tells the agent which proof to run

## Corrective Move

Prefer small moves:

1. move order-specific behavior back into `features/orders/service.*`
2. expose only supported behavior from `features/orders/index.*`
3. move runtime API creation to `platform/api/*`
4. document the proof lane before changing more call sites

Do not rename the whole tree just to match example paths.
