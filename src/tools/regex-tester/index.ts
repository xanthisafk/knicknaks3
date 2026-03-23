import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "RegEx Tester",
  slug: "regex-tester",
  description: "Test and debug JavaScript regex patterns with live match highlighting",
  category: "dev",
  icon: "🔍",
  keywords: [
    "regex tester online",
    "javascript regex tester",
    "regex debugger",
    "regex visualizer",
    "test regex pattern",
    "regex match highlighter",
    "regex playground",
    "capture group tester"
  ],
  tags: ["developer", "regex", "debugging"],
  status: "updated",
  component: () => import("./RegexTesterTool"),
  capabilities: { supportsOffline: true },

  faq: [
    {
      question: "Which RegEx engine does this tool use?",
      answer:
        "It uses your browser's native JavaScript RegExp engine, so results match real-world JS behavior."
    },
    {
      question: "Which flags are supported?",
      answer:
        "You can toggle common flags like global (g), case-insensitive (i), multiline (m), and dotAll (s)."
    },
    {
      question: "Can I inspect capture groups?",
      answer:
        "Yes. Any groups defined with parentheses are listed with their matched values for each result."
    },
    {
      question: "Does it highlight all matches?",
      answer:
        "Yes. When matches are found, they are highlighted directly in the input text along with their positions."
    },
    {
      question: "Is my data sent anywhere?",
      answer:
        "No. All pattern matching runs locally in your browser."
    },
    {
      question: "Does it support advanced regex features?",
      answer:
        "Yes. Most modern JavaScript features like lookaheads and (in supported browsers) lookbehinds are supported."
    }
  ],

  howItWorks:
    "Enter a regex pattern and select flags, then provide test text. Matches are highlighted in real time, with detailed breakdowns including index positions and capture groups.",

  relatedTools: ["string-escaper", "json-formatter", "jwt-decoder"],
  schemaType: "WebApplication",
  createdAt: "2026-03-12",
  launchedAt: "2026-03-12",
  updatedAt: "2026-03-23",
};