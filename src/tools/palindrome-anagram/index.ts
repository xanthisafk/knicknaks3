import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Palindrome & Anagram Checker",
  slug: "palindrome-anagram",
  description: "Detect palindromes, check if two strings are anagrams, and find anagram combinations.",
  category: "text",
  icon: "🔁",
  keywords: ["palindrome", "anagram", "check", "word", "reverse", "letter", "rearrange"],
  tags: ["text", "fun", "word-games"],
  component: () => import("./PalindromeAnagramTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What is a palindrome?", answer: "A word or phrase that reads the same forwards and backwards, ignoring spaces and punctuation — e.g. 'racecar' or 'A man a plan a canal Panama'." },
    { question: "What is an anagram?", answer: "Two words or phrases that use the same letters in a different order — e.g. 'listen' and 'silent'." },
  ],
  howItWorks: "Enter a word or phrase to check if it's a palindrome. Enter two strings to check if they're anagrams of each other.",
  relatedTools: ["word-counter", "reverse-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
