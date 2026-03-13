import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Find & Replace",
  slug: "find-replace",
  description: "Find and replace text instantly with optional Regex support.",

  longDescription:
    "Quickly scan and modify large blocks of text with our advanced Find & Replace utility. Easily perform simple text substitutions or leverage the immense power of full JavaScript Regular Expressions (Regex) complete with capture group replacements in a live preview environment.",

  category: "text",
  icon: "🔎",
  status: "updated",

  keywords: [
    "find and replace text online",
    "regex replace string",
    "text substitution tool",
    "bulk replace words",
    "regexp string modifier",
    "live text search replace",
    "find and substitute",
    "online find replace tool",
    "replace text with regex",
    "text replace utility",
    "search and replace text",
    "regex find replace"
  ],

  tags: ["text", "developer", "editing"],

  component: () => import("./FindReplaceTool"),

  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What does the Find & Replace tool do?",
      answer:
        "This tool searches for specific text within a document and replaces it with new text. It is useful for quickly editing repeated words, phrases, or patterns across large blocks of content."
    },
    {
      question: "Can I use Regex for advanced replacing?",
      answer:
        "Yes. Enable Regex mode to use full JavaScript regular expression syntax. This allows you to perform advanced pattern matching and dynamic replacements."
    },
    {
      question: "Can I use capture groups in replacements?",
      answer:
        "Yes. When using Regex mode, you can reference capture groups in the replacement field using syntax such as `$1`, `$2`, or `$3` to reuse parts of the matched text."
    },
    {
      question: "Is the search case-sensitive?",
      answer:
        "By default the search is case-insensitive, but you can toggle case sensitivity using the dedicated option if you need exact character matching."
    },
    {
      question: "Can I replace multiple matches at once?",
      answer:
        "Yes. The tool can replace every occurrence of the search pattern across the entire text input in a single operation."
    },
    {
      question: "Does the tool highlight matches before replacing?",
      answer:
        "Yes. All matches are highlighted live in the editor so you can visually confirm the results before applying replacements."
    },
    {
      question: "Can I replace line breaks or tabs?",
      answer:
        "Yes. When using Regex mode you can match special characters such as `\\n` for newlines and `\\t` for tabs."
    },
    {
      question: "Is this tool useful for developers?",
      answer:
        "Yes. Developers often use find-and-replace tools to refactor variable names, update code patterns, or modify structured text using regex expressions."
    },
    {
      question: "Can I edit large blocks of text?",
      answer:
        "Yes. The tool is designed to handle large text inputs and quickly perform replacements across the entire document."
    },
    {
      question: "Is my text sent to a server?",
      answer:
        "No. All searching and replacements happen locally in your browser, so your content remains private."
    },
    {
      question: "Does the tool work offline?",
      answer:
        "Yes. Once the page has loaded, all functionality runs in the browser and can work without an active internet connection."
    }
  ],

  howItWorks:
    "Paste or type your source text into the editor, then enter the word, phrase, or pattern you want to search for in the Find field. Next, type the replacement text in the Replace field. The tool scans the document in real time and highlights every matching instance so you can preview exactly what will change. If Regex mode is enabled, the search field interprets the input as a JavaScript regular expression and allows advanced pattern matching and capture group replacements. Once you're satisfied with the preview, apply the replacement to update all matching text instantly.",

  relatedTools: ["regex-tester", "text-diff"],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-13",
};