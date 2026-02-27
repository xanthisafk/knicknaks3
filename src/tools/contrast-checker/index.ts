import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Contrast Checker",
  slug: "contrast-checker",
  description: "Check foreground/background color contrast against WCAG 2.1 AA and AAA standards.",
  category: "converters",
  icon: "♿",
  keywords: ["contrast", "wcag", "accessibility", "a11y", "color", "ratio", "aa", "aaa"],
  tags: ["accessibility", "color", "design"],
  component: () => import("./ContrastCheckerTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What are WCAG AA and AAA?", answer: "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. AAA requires 7:1 for normal and 4.5:1 for large text." },
  ],
  howItWorks: "Pick or enter foreground and background colors. The tool instantly calculates the contrast ratio and shows pass/fail for WCAG AA and AAA levels.",
  relatedTools: ["color-converter", "palette-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
