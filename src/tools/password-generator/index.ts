import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Password Generator",
  slug: "password-generator",
  description: "Generate cryptographically secure, random passwords locally in your browser.",
  longDescription:
    "Protect your digital identity with an unbreakable password. This generator utilizes the browser's native Web Crypto API to guarantee true cryptographic randomness. " +
    "Customize the exact length, enforce specific character sets (uppercase, numbers, symbols), and analyze your password's entropy strength in real-time. Completely private offline processing.",
  category: "generators",
  icon: "🔑",
  keywords: ["password generator online", "secure random passwords", "strong password maker", "generate cryptographic password", "entropy password checker", "safe password creator", "local password generator"],
  tags: ["security", "generator"],

  component: () => import("./PasswordGeneratorTool"),

  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "How secure are these generated passwords?",
      answer: "Extremely secure. Unlike simple math tools, this generator requests randomness directly from your operating system using `crypto.getRandomValues()`, ensuring the generated output is not mathematically predictable.",
    },
    {
      question: "What does 'password entropy' mean?",
      answer: "Entropy is a technical measurement of a password's randomness, calculated in bits. The higher the entropy score, the harder the password is for a computer to crack via brute force. 80+ bits generally indicates a very strong password.",
    },
    {
      question: "Is my new password saved anywhere on your servers?",
      answer: "No. The entire generation process executes securely inside your web browser. No data leaves your machine, making it fundamentally impossible for us to know or save the password you create."
    }
  ],

  howItWorks: "Use the sliders and checkboxes to configure your desired password length and required character types. Click 'Generate' to create a new secure string. The visual entropy bar instantly displays its relative cryptographic strength.",
  relatedTools: ["hash-generator", "uuid-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
