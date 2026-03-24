import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "String Escaper",
  slug: "string-escaper",
  description: "Escape strings for JavaScript, JSON, HTML, SQL and CSV",
  category: "dev",
  icon: "🧵",
  keywords: [
    "string escaper",
    "escape string online",
    "unescape string tool",
    "javascript escape string",
    "json escape string",
    "html encode decode",
    "sql string escape",
    "csv escape quotes",
    "text escape characters",
    "sanitize string tool"
  ],
  tags: ["developer", "encoding"],
  component: () => import("./StringEscaperTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "What does escaping a string mean?",
      answer: "Escaping converts special characters like quotes, backslashes, and newlines into safe representations so they can be used in code without breaking syntax."
    },
    {
      question: "How do I escape a JavaScript string?",
      answer: "Special characters like quotes (`\"`, `\\'`) and line breaks (`\\n`) are prefixed with backslashes so they are treated as literal values in JavaScript."
    },
    {
      question: "What is JSON string escaping?",
      answer: "JSON escaping ensures strings are valid inside JSON by escaping quotes, control characters, and backslashes according to the JSON specification."
    },
    {
      question: "How does HTML escaping work?",
      answer: "HTML escaping converts characters like `<`, `>`, and `&` into entities (`&lt;`, `&gt;`, `&amp;`) to prevent rendering or injection issues."
    },
    {
      question: "Why is SQL string escaping important?",
      answer: "Escaping single quotes prevents syntax errors and reduces the risk of SQL injection by ensuring user input is treated as data, not executable code."
    },
    {
      question: "Can I reverse escaped strings?",
      answer: "Yes. Switch to unescape mode to convert escaped sequences back into their original readable form."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, all escaping and unescaping works entirely offline."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. All processing happens locally in your browser with no data sent to any server."
    }
  ],

  howItWorks:
    "Paste your text, choose a format like JavaScript, JSON, HTML, SQL, or CSV, and instantly see the escaped or unescaped result. Everything runs locally in your browser.",

  relatedTools: ["html-entities"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-25",
};
