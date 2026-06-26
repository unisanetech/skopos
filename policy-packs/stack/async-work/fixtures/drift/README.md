# Drift Async Work Fixture

This fixture describes `stack.async-work.drift-unowned-redis-queue`.

Intentional drift:

1. Redis or queue dependency appears in package manifests
2. no stack decision explains why the dependency is needed
3. no local worker command is documented
4. retryable side effects have no idempotency policy
5. closure can pass without proving failed-job behavior
