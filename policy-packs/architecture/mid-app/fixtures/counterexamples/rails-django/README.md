# Valid Rails or Django mapping

```text
app/{controllers,models,services}/**
config/routes.rb

project_app/{views,models,services}/**
manage.py
```

Framework conventions already provide composition, feature behavior, and adapters. Skopos should map the local convention and ask for human confirmation where one folder serves more than one role; it must not demand a TypeScript-style tree.
