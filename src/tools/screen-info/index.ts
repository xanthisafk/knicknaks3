import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Screen Info",
  slug: "screen-info",
  description: "View your device's screen resolution, viewport size, DPR, and browser capabilities.",
  category: "dev",
  icon: "📱",
  keywords: ["screen", "resolution", "viewport", "dpr", "pixel", "density", "display", "device"],
  tags: ["developer", "device"],
  component: () => import("./ScreenInfoTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Displays real-time information about your screen, viewport, device pixel ratio, and browser feature support. Resize the window to see values update.",
  relatedTools: ["user-agent-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
