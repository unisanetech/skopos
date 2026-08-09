# Valid plugin mapping

```text
core/{host,contracts}.*
plugins/payments/{entry,behavior,test}.*
plugins/search/{entry,behavior,test}.*
```

The host is the composition root; plugin entrypoints are explicit feature surfaces. Dependencies flow through core contracts. A missing conventional app or feature folder is not drift.
