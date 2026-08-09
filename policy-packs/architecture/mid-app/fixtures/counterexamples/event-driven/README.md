# Valid event-driven mapping

```text
services/orders/{consumer,domain,publisher}.*
services/billing/{consumer,domain,publisher}.*
runtime/broker.*
```

Consumers are boundary entrypoints, each service owns behavior, and `runtime/broker.*` is an adapter. The pack must not require HTTP routes or screen folders.
