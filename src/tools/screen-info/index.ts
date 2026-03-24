import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Screen Info",
  slug: "screen-info",
  description: "Check your screen resolution, viewport size, DPR, and device details instantly.",
  category: "dev",
  icon: "📱",
  keywords: [
    "what is my screen resolution",
    "check screen size online",
    "viewport size checker",
    "device pixel ratio test",
    "what is my screen size",
    "browser window size tool",
    "detect screen resolution",
    "retina display checker",
    "screen dimensions finder",
    "display info tool"
  ],
  tags: ["developer", "device"],
  component: () => import("./ScreenInfoTool"),
  capabilities: { supportsOffline: true },

  faq: [
    {
      question: "What is my screen resolution?",
      answer: "Your screen resolution is the total number of physical pixels your display supports (e.g., 1920×1080). This tool detects it directly from your device."
    },
    {
      question: "What is the difference between screen resolution and viewport size?",
      answer: "Screen resolution is your display’s full pixel size. Viewport size is the visible area inside your browser window, which changes when you resize the window."
    },
    {
      question: "What is Device Pixel Ratio (DPR)?",
      answer: "DPR is the ratio of physical pixels to CSS pixels. A DPR of 2 means each CSS pixel uses 4 physical pixels, resulting in sharper visuals on high-density displays."
    },
    {
      question: "Why does my viewport size change?",
      answer: "Viewport size changes when you resize your browser window, open dev tools, or switch device orientation."
    },
    {
      question: "Can I use this tool for responsive design testing?",
      answer: "Yes. Developers commonly use viewport and DPR data to test layouts across different screen sizes and pixel densities."
    },
    {
      question: "Does this tool work on mobile devices?",
      answer: "Yes. It detects screen size, orientation, touch support, and DPR on smartphones and tablets."
    },
    {
      question: "Is my data sent to a server?",
      answer: "No. All data is read locally from your browser APIs and never transmitted."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, it works fully offline."
    }
  ],

  howItWorks:
    "The tool reads your device and browser data using built-in APIs like window, screen, and navigator. Values update in real time as you resize your browser or change device orientation.",

  relatedTools: ["user-agent-parser"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};
