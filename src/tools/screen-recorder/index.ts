import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
    name: "Screen Recorder",
    slug: "screen-recorder",
    description: "Capture your screen and audio instantly—no installs, no uploads, total privacy.",
    longDescription:
        "A pro-grade screen capture tool that runs entirely in your browser. Record your desktop, specific windows, or browser tabs in native resolution with optional microphone support. Built on the MediaRecorder API for maximum security and zero latency.",

    category: "media",
    icon: "🎥",
    keywords: [
        "screen recorder browser",
        "no install recorder",
        "private screen capture",
        "record browser tab",
        "web-based screen recording",
        "free screen recorder",
        "record audio and screen",
    ],
    tags: ["media", "record", "screen", "privacy"],

    component: () => import("./ScreenRecorderTool"),

    capabilities: {
        supportsFileInput: false,
        supportsOffline: true,
    },

    faq: [
        {
            question: "Is my recording private?",
            answer: "Absolutely. The recording is processed entirely in your browser's memory. No data is ever sent to a server.",
        },
        {
            question: "What file formats are supported?",
            answer: "It typically saves as WebM or MP4, depending on what your specific browser (Chrome, Firefox, or Safari) supports best.",
        },
        {
            question: "Can I record my microphone?",
            answer: "Yes! You can toggle microphone input and select your preferred device before starting the recording.",
        },
        {
            question: "Does it record system audio?",
            answer: "Most browsers allow you to include 'Tab Audio' when sharing a specific tab. Full system audio depends on your OS permissions.",
        },
        {
            question: "Is there a recording time limit?",
            answer: "There are no artificial limits. You are only limited by your computer's available disk space and RAM.",
        },
        {
            question: "Do I need to install an extension?",
            answer: "No. This tool uses native web APIs, so it works directly in your browser without any extra software.",
        },
        {
            question: "Does it work on mobile?",
            answer: "Screen recording via browser is currently best supported on desktop. Mobile browsers often restrict screen-sharing APIs for security.",
        },
        {
            question: "Can I record in 4K?",
            answer: "The tool records at your screen's native resolution. If you have a 4K monitor, you can record in 4K.",
        },
        {
            question: "Why is the frame rate capped at 60 FPS?",
            answer: "Most browsers and the MediaRecorder API cap screen capture at 60 FPS to ensure system stability and sync.",
        },
        {
            question: "Are there any watermarks?",
            answer: "Never. You get the clean, raw recording exactly as it appears on your screen.",
        },
    ],

    howItWorks:
        "Select your source (Tab, Window, or Entire Screen), toggle your microphone if needed, and hit 'Start'. When you're done, preview your clip and download it instantly to your device.",

    relatedTools: [],
    schemaType: "WebApplication",
    createdAt: "2026-03-15",
};