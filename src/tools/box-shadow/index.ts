import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Box Shadow Generator",
  slug: "box-shadow",
  description: "Slider UI for offset, blur, spread, and color — generates a ready-to-use CSS box-shadow snippet.",
  category: "dev",
  icon: "🟫",
  keywords: ["box", "shadow", "css", "generator", "blur", "spread", "offset", "design"],
  tags: ["design", "css", "developer"],
  component: () => import("./BoxShadowTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I add multiple shadows?", answer: "Yes — add multiple shadow layers that stack together." },
    { question: "What is spread?", answer: "Spread expands or contracts the shadow size beyond the element's borders." },
  ],
  howItWorks: "Adjust sliders for X/Y offset, blur, spread, and color. Preview renders in real-time. Copy the CSS snippet.",
  relatedTools: ["gradient-maker", "css-filter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
