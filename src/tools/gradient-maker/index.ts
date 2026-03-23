import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Gradient Maker",
  slug: "gradient-maker",
  description: "Visual CSS gradient builder. Select stops, angle and type",
  category: "color",
  icon: "🌈",
  keywords: ["css gradient generator", "radial background maker", "linear gradient builder", "conic css backgrounds", "visual gradient editor", "css color stops tool", "ui design backgrounds"],
  tags: ["color", "design", "css"],
  component: () => import("./GradientMakerTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What types of CSS gradients are supported?", answer: "Our tool supports exactly what modern browsers support: Linear (directional), Radial (circular/elliptical), and Conic (sweeping around a center point) gradients." },
    { question: "Can I add more than two colors?", answer: "Yes! You can add virtually unlimited 'color stops' along the gradient line to construct dense, complex, or sharply-banded background transitions." },
    { question: "Is the exported CSS compatible everywhere?", answer: "We generate standard CSS3 `background-image` syntax which is universally supported across all modern web browsers including Chrome, Safari, Firefox, and Edge." }
  ],
  howItWorks: "Add your desired color stops to the interactive gradient bar. Choose between linear, radial, or conic modes and adjust angles or center positions. See your background render live before clicking to copy the final CSS snippet.",
  relatedTools: ["color-converter", "palette-generator", "box-shadow"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-19",
};
