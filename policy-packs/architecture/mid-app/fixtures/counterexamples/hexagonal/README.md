# Valid hexagonal mapping

```text
domain/**
ports/**
adapters/{http,database}/**
cmd/server/**
```

`cmd/server` composes the system, ports define stable boundaries, and adapters own runtime integrations. These names satisfy the principles even though no `features/` directory exists.
