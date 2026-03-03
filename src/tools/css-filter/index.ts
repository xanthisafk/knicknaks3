import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "CSS Filter Generator",
  slug: "css-filter",
  description: "Visual CSS image filter generator. Adjust blur, brightness, contrast, hue, and copy the CSS instantly.",
  longDescription: "Effortlessly design striking image effects right in your browser. The CSS Filter Generator provides an intuitive slider interface to fine-tune visual properties like blur, brightness, contrast, grayscale, and hue-rotation. Live-preview your changes on a sample image and copy the generated CSS directly into your project.",
  category: "dev",
  icon: "🔆",
  keywords: ["css filter generator", "css image effects builder", "blur effect css", "brightness contrast css tool", "grayscale image css", "visual css filters ui", "photo filter css code"],
  tags: ["design", "css", "developer"],
  component: () => import("./CssFilterTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Which CSS filter functions are supported?", answer: "You can combine multiple filters including Brightness, Contrast, Saturation, Grayscale, Sepia, Hue-Rotate, Blur, Invert, and overall Opacity." },
    { question: "Can I test the filters on my own image?", answer: "Yes. While we provide a default placeholder image, you can upload any local image file to see exactly how the composite CSS filters will affect your specific media." },
    { question: "Are CSS filters performant for web design?", answer: "Modern browsers utilize hardware acceleration (GPU) to render CSS filters, making them highly performant and often much superior to loading heavily pre-processed visual image assets." }
  ],
  howItWorks: "Upload your image or use the default demo. Manipulate the range sliders for various CSS filters to see your image dynamically alter in real-time. Once satisfied, click to copy the compiled `filter:` CSS string for your stylesheet.",
  relatedTools: ["box-shadow", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
