# React Boundaries

Keep data access and non-interactive rendering on the server when the bound framework
supports it. Add a client boundary only for state, event handlers, lifecycle behavior,
or browser-only APIs, and keep that boundary as narrow as the interaction permits.

Project architecture overrides generic framework advice. Do not introduce React,
server components, or a particular rendering model into a project that does not use it.
