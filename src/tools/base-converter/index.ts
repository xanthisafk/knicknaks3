import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Universal Base Converter",
  slug: "base-converter",
  description: "Convert numbers across any base (binary, octal, decimal, hex)",
  longDescription: "The Universal Base Converter allows you to seamlessly translate numbers between any numeral bases from 2 up to 36. Easily convert binary to hexadecimal, decimal to octal, or use completely custom bases for computer science and programming tasks.",
  category: "encoders",
  icon: "🔢",
  keywords: ["base converter online", "binary to hex converter", "decimal to binary", "octal converter", "hexadecimal calculator", "number base translation", "radix converter", "custom base conversion"],
  tags: ["encoding", "math", "developer"],
  component: () => import("./BaseConverterTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What bases are supported?", answer: "The converter supports any numeric base from 2 (binary) up to 36. You can easily switch between common developer bases like 2, 8, 10, and 16, or define your own." },
    { question: "How numbers are converted between bases?", answer: "The tool parses the input string as an integer in the source base and then reformats the underlying numeric value into the string representation of your target base." },
    { question: "Why do bases stop at 36?", answer: "Base 36 encompasses the 10 numeric digits (0-9) plus the 26 letters of the English alphabet (A-Z). This represents the highest universally standard radix system before requiring specialized character sets." }
  ],
  howItWorks: "Type any number into the input field and specify its current base. The tool instantly computes and displays the equivalent value across all major programming bases and any custom radix you choose.",
  relatedTools: ["rot-cipher", "base64"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-18",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
