import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Password Generator",
  slug: "password-generator",
  description: "Generate cryptographically secure passwords with customizable length, character sets, and entropy feedback.",
  category: "generators",
  icon: "🔑",
  keywords: ["password", "generate", "secure", "random", "crypto", "strong", "entropy"],
  tags: ["security", "generator"],

  component: () => import("./PasswordGeneratorTool"),

  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "How secure are these passwords?",
      answer: "Passwords are generated using crypto.getRandomValues(), a cryptographically secure random number generator built into your browser.",
    },
    {
      question: "What is password entropy?",
      answer: "Entropy measures randomness in bits. Higher entropy = harder to crack. 80+ bits is considered very strong.",
    },
  ],

  howItWorks: "Configure your password length and character sets, then click Generate. The entropy bar shows password strength. Copy with one click.",
  relatedTools: ["hash-generator", "uuid-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
