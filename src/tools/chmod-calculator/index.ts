import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Chmod Calculator",
  slug: "chmod-calculator",
  description: "Visual checkbox UI for Unix file permissions — converts between symbolic, octal, and numeric modes.",
  category: "dev",
  icon: "🔒",
  keywords: ["chmod", "permissions", "unix", "linux", "octal", "symbolic", "rwx", "file", "mode"],
  tags: ["developer", "linux", "sysadmin"],
  component: () => import("./ChmodCalculatorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is chmod?", answer: "chmod (change mode) is a Unix command to set file/folder permissions for owner, group, and others." },
    { question: "What does 755 mean?", answer: "7 = rwx (owner), 5 = r-x (group), 5 = r-x (others). Owner can read/write/execute, others can read/execute." },
  ],
  howItWorks: "Check the permission boxes for owner, group, and others. The octal value and chmod command update instantly.",
  relatedTools: ["screen-info", "url-parser"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
