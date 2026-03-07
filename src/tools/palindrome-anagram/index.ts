import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Palindrome & Anagram Checker",
  slug: "palindrome-anagram",
  description: "Detect if text is palindromes or anagrams",
  longDescription: "Solve word puzzles or validate string logic quickly. Our Palindrome & Anagram Checker analyzes your text to determine if it reads the exact same forwards and backwards (a palindrome), or if two distinct phrases use the exact same letters in a different order (an anagram). Perfect for linguistic students and developers.",
  category: "text",
  icon: "🔁",
  keywords: ["palindrome checker", "anagram solver online", "check if anagram", "is it a palindrome", "reverse word puzzle", "text phrase anagram tool", "letters rearrange words"],
  tags: ["text", "fun", "word-games"],
  component: () => import("./PalindromeAnagramTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What exactly is a palindrome?", answer: "A palindrome is a word, phrase, or number that reads symmetrically the same forwards and backwards. Our tool automatically ignores spaces and punctuation to accurately detect complex palindromes like 'A man, a plan, a canal: Panama'." },
    { question: "What qualifies as an anagram?", answer: "An anagram is created by taking all the letters of one phrase and rearranging them to form a completely different phrase (e.g., 'listen' becomes 'silent'). Both phrases must use the exact same letters the exact same number of times." },
    { question: "Is the checking case-sensitive?", answer: "No, the checker normalizes all text. It treats capital 'A' and lowercase 'a' as the same letter to provide accurate real-world results." }
  ],
  howItWorks: "Enter a single word or sentence into the first box to test if it passes as a valid palindrome. To check for an anagram, type a second phrase into the target box; the tool will instantly compare the letter frequencies to see if they match perfectly.",
  relatedTools: ["word-counter", "reverse-text"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
