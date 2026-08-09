# Valid vertical-slice mapping

```text
src/
  slices/orders/{route,handler,model,test}.*
  slices/billing/{route,handler,model,test}.*
  bootstrap.*
```

Each slice owns its workflow end to end. `bootstrap.*` is the composition root and the slice folders are feature owners. The pack must map those roles without requiring `features/`, `application/`, or `infrastructure/` folders.
