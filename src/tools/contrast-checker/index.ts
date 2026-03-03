import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Contrast Checker",
  slug: "contrast-checker",
  description: "Validate foreground/background color accessibility against strict WCAG AA and AAA standards.",
  longDescription: "Ensure your website design is accessible to all users visually. Our comprehensive Contrast Checker instantly calculates the contrast ratio between text and background colors, verifying compliance with the Web Content Accessibility Guidelines (WCAG) 2.1 AA and AAA standards for normal, large, and graphical elements.",
  category: "converters",
  icon: "♿",
  keywords: ["color contrast checker", "wcag contrast ratio", "accessibility color tool", "a11y contrast validator", "aa aaa compliance", "web design accessibility", "foreground background checker", "accessible color palette"],
  tags: ["accessibility", "color", "design"],
  component: () => import("./ContrastCheckerTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What are WCAG AA and AAA standards?", answer: "WCAG AA requires a baseline contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. The stricter AAA rating requires a 7:1 ratio for normal text and 4.5:1 for large text, ensuring maximum legibility for visually impaired users." },
    { question: "What qualifies as 'Large Text'?", answer: "Under WCAG guidelines, text is usually considered 'large' if it is approximately 18pt (24px) or larger, or 14pt (18.5px) and bold." },
    { question: "Why is an accessible contrast ratio important?", answer: "High color contrast is essential for users with visual impairments, color blindness, or those reading screens in tough lighting environments (like bright sunlight). It is also a fundamental ranking factor for modern SEO and usability." }
  ],
  howItWorks: "Select your desired foreground (text) and background colors using HEX, RGB, or the visual picker. The tool algorithmically computes the relative luminance and instantly displays the exact contrast ratio alongside definitive Pass/Fail grades for WCAG standard levels.",
  relatedTools: ["color-converter", "palette-generator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
