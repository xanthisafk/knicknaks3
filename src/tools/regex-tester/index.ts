import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "RegEx Tester",
  slug: "regex-tester",
  description: "Interactive Regular Expression playground",
  longDescription: "Master pattern matching with our interactive RegEx Tester. Build, debug, and validate complex Regular Expressions (RegEx) against custom text strings. The tool provides immediate, color-coded visual feedback highlighting exact matches and isolating specific capture groups to eliminate endless trial-and-error programming.",
  category: "dev",
  icon: "🔍",
  keywords: ["regex tester online", "regular expression checker", "test regex pattern", "javascript regex match", "capture group highlighter", "regex debugger tool", "validate email regex"],
  tags: ["developer", "regex"],
  component: () => import("./RegexTesterTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Which RegEx engine does this tool use?", answer: "This tool utilizes your browser's native JavaScript Regular Expression engine. It fully supports standard JS flags such as 'g' (global), 'i' (case-insensitive), and 'm' (multiline)." },
    { question: "Can it extract specific capture groups?", answer: "Yes! If you wrap sub-patterns in parentheses `()`, the tool automatically parses and lists the exact content extracted by those specific capture groups below the main match." },
    { question: "Is my test data sent to a server?", answer: "No. All pattern compilation and string matching happens securely within your local browser, meaning your sensitive test data is completely private." }
  ],
  howItWorks: "Input your Regular Expression pattern into the top field and select your desired modifier flags (like 'g' or 'i'). Paste your sample text into the large text area below. The tool will instantly highlight any successful matches and itemize their respective capture groups.",
  relatedTools: ["string-escaper", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
