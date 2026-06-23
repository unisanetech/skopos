# Drift Mid-App Fixture

This fixture describes `architecture.mid-app.drift-cross-feature-and-shared-bucket`.

Intentional drift:

1. `src/shared/helpers.ts` mixes unrelated concerns and hides order-specific business behavior
2. `src/features/billing/service.ts` imports a private orders component path
3. `src/features/orders/components/order-list.tsx` creates a runtime API client directly
4. no validation-lane document exists in the fixture

Future automated checks should flag these as pack violations while allowing projects to override them when local policy intentionally differs.
