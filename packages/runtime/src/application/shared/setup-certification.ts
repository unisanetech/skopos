// Source-mode CLI commands can execute before the model package has been rebuilt.
// Keep the runtime discriminator local and shared by every runtime authority; the
// public model contract exports the same stable value for external consumers.
export const SKOPOS_RUNTIME_SETUP_CERTIFICATION_CONSTRAINT =
  'skopos.setup-certification.v1' as const;
