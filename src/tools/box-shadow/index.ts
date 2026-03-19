import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Box Shadow Generator",
  slug: "box-shadow",
  description: "Visual CSS box-shadow generator",
  category: "dev",
  icon: "🟫",
  keywords: ["css box shadow generator", "drop shadow css tool", "box shadow css code", "visual shadow editor", "css blur spread offset", "web design shadow tool", "css styling generator"],
  tags: ["design", "css", "developer"],
  component: () => import("./BoxShadowTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I add multiple drop shadows to one element?", answer: "Yes! CSS allows you to comma-separate multiple shadow values. You can easily add and stack multiple shadow layers together in our generator to create complex 3D or glowing effects." },
    { question: "What does the 'spread' value do?", answer: "The spread radius expands or contracts the shadow size beyond the element's actual borders before the blur is applied. A positive spread makes the shadow larger, while a negative spread makes it smaller than the element itself." },
    { question: "Is the generated CSS cross-browser compatible?", answer: "Absolutely. The `box-shadow` property is universally supported across all modern browsers, including Chrome, Firefox, Safari, and Edge. We generate clean, standard CSS." }
  ],
  howItWorks: "Simply adjust the visual sliders to customize the horizontal (X) and vertical (Y) offset, blur radius, spread, and shadow color/opacity. Watch the real-time preview update as you tweak values, then click to copy the ready-to-use CSS snippet.",
  relatedTools: ["gradient-maker", "css-filter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-18",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
