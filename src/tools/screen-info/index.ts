import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Screen Info",
  slug: "screen-info",
  description: "Get local screen info of device",
  longDescription: "A vital diagnostic tool for frontend web developers and UI designers. Instantly view critical hardware and browser rendering metrics including raw Screen Resolution, active CSS Viewport width/height, Device Pixel Ratio (Retina scaling), Color Depth, and hardware concurrency threads. Values update live as you resize your browser window.",
  category: "dev",
  icon: "📱",
  keywords: ["what is my screen resolution", "viewport size finder", "device pixel ratio detector", "monitor pixel density", "browser window size", "test retina screen", "detect screen depth"],
  tags: ["developer", "device"],
  component: () => import("./ScreenInfoTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What is the difference between Screen Resolution and Viewport Size?", answer: "Screen Resolution represents the total maximum physical pixels of your hardware monitor (e.g., 1920x1080). Viewport Size is the active, usable CSS space inside your web browser window, which shrinks if you leave full-screen mode or open sidebars." },
    { question: "What does 'Device Pixel Ratio' (DPR) mean?", answer: "DPR is the ratio between physical hardware pixels and logical CSS pixels. Devices like Apple's Retina displays have a DPR of 2 or 3, meaning they pack 4 to 9 physical pixels into a single CSS pixel to render incredibly sharp text and images." }
  ],
  howItWorks: "The tool queries your browser's native `window` and `screen` APIs upon loading. It displays the extracted data inside clean, organized cards. Try dragging the edges of your browser window to see the Viewport dimensions update instantly in real-time.",
  relatedTools: ["user-agent-parser"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
