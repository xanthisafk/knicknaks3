import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "RegEx Tester",
  slug: "regex-tester",
  description: "Test, debug, and visualize Regular Expression patterns directly in your browser.",
  longDescription: "Master pattern matching with our interactive RegEx Tester. Build, debug, and validate complex Regular Expressions (RegEx) against custom text strings. The tool provides immediate, color-coded visual feedback highlighting exact matches and isolating specific capture groups to eliminate endless trial-and-error programming.",
  category: "dev",
  icon: "🔍",
  keywords: [
    "regex tester online",
    "regular expression checker",
    "test regex pattern",
    "javascript regex match",
    "capture group highlighter",
    "regex debugger tool",
    "validate email regex",
    "regex visualizer",
    "regex pattern tester",
    "regex playground",
    "regex debugging tool",
    "test regex online",
    "regex match checker"
  ],
  tags: ["developer", "regex"],
  status: "updated",
  component: () => import("./RegexTesterTool"),
  capabilities: { supportsOffline: true },

  faq: [
    {
      question: "Which RegEx engine does this tool use?",
      answer:
        "The tester uses your browser's native JavaScript Regular Expression engine. This means patterns behave exactly as they would in JavaScript environments such as Node.js or front-end applications."
    },
    {
      question: "Which flags are supported?",
      answer:
        "Standard JavaScript flags are supported, including `g` (global), `i` (case-insensitive), `m` (multiline), `s` (dotAll), `u` (unicode), and `y` (sticky). You can toggle these modifiers to observe how they affect pattern matching."
    },
    {
      question: "Can it extract specific capture groups?",
      answer:
        "Yes. Any sub-pattern wrapped in parentheses `()` is treated as a capture group. The tool automatically lists the content matched by each capture group so you can inspect exactly what was extracted."
    },
    {
      question: "Does it highlight multiple matches?",
      answer:
        "Yes. When the `g` (global) flag is enabled, the tool highlights every match found within the input text so you can visually confirm where the pattern applies."
    },
    {
      question: "Is my test data sent to a server?",
      answer:
        "No. All regex compilation and matching occur directly in your browser. Your patterns and sample text remain local and are never transmitted externally."
    },
    {
      question: "Can I test complex expressions?",
      answer:
        "Yes. The tester supports advanced constructs such as lookaheads, lookbehinds (where supported by your browser), alternations, nested capture groups, and quantifiers."
    },
    {
      question: "Does it support lookahead and lookbehind?",
      answer:
        "Positive and negative lookaheads (`(?=...)`, `(?!...)`) are fully supported. Lookbehinds (`(?<=...)`, `(?<!...)`) work in modern browsers that implement the ES2018 RegEx standard."
    },
    {
      question: "What is a capture group?",
      answer:
        "A capture group is a portion of a regex pattern enclosed in parentheses that extracts part of the matched text. These groups are commonly used for parsing structured data like URLs, emails, or log entries."
    },
    {
      question: "Why does my regex match differently than expected?",
      answer:
        "Regex behavior can change depending on flags, quantifiers, greedy vs lazy matching, and line boundaries. Testing patterns interactively helps identify exactly where the expression behaves differently than intended."
    },
    {
      question: "Can this tool help debug regex patterns?",
      answer:
        "Yes. The visual highlighting and capture group breakdown make it easier to see which parts of your expression match successfully and which parts need adjustment."
    },
    {
      question: "Does this tool work offline?",
      answer:
        "Yes. Once the page is loaded, the tester runs entirely in the browser and can continue working even without an active internet connection."
    },
    {
      question: "Can I test email, URL, or password regex patterns?",
      answer:
        "Yes. The tester is useful for validating patterns commonly used for form validation such as emails, URLs, phone numbers, passwords, and other structured inputs."
    }
  ],

  howItWorks:
    "Enter your Regular Expression pattern into the pattern field and enable any modifier flags you want to test (such as `g`, `i`, or `m`). Next, paste or type the sample text you want to evaluate into the input area. As you edit either the pattern or the text, the tool immediately evaluates the expression using the browser's JavaScript RegEx engine. All matching segments are highlighted directly in the text, allowing you to visually confirm the exact matches. If your expression contains capture groups using parentheses `()`, the tool also lists each group's extracted value so you can inspect how specific parts of the pattern behave. This real-time feedback helps you quickly refine patterns, debug unexpected matches, and experiment with different flags or quantifiers.",

  relatedTools: ["string-escaper", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-12",
};