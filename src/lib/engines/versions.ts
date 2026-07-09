export const ENGINE_VERSIONS = {
  tax: "v2026.1",
  epf: "v2026.1",
  gratuity: "v2026.1",
  leaveEncashment: "v2026.1",
  insights: "v2026.1",
  optimization: "v2026.1",
} as const;

export type EngineName = keyof typeof ENGINE_VERSIONS;
