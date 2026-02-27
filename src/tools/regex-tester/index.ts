import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "RegEx Tester",
  slug: "regex-tester",
  description: "Live interactive regex playground with match highlighting and capture group inspection.",
  category: "dev",
  icon: "🔍",
  keywords: ["regex", "regular", "expression", "test", "match", "pattern", "capture", "group"],
  tags: ["developer", "regex"],
  component: () => import("./RegexTesterTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Enter a regex pattern and flags, then type test strings to see matches highlighted in real-time with capture groups.",
  relatedTools: ["string-escaper", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
