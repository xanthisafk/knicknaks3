import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "EXIF Metadata Viewer",
  slug: "exif-metadata-viewer",
  description:
    "View EXIF metadata entirely in your browser",

  longDescription:
    "Inspect hidden metadata embedded in photos using this EXIF metadata viewer. Upload an image to instantly view details such as camera model, lens type, shutter speed, ISO, GPS coordinates, and capture date. " +
    "This tool is useful for photographers, developers, and privacy-conscious users who want to analyze or verify image metadata. " +
    "All processing happens locally inside your browser, ensuring your photos remain completely private and are never uploaded to a server.",

  category: "media",
  status: "new",
  icon: "📷",

  keywords: [
    "exif viewer",
    "image metadata viewer",
    "photo metadata viewer",
    "view exif data online",
    "check photo gps metadata",
    "image exif reader",
    "camera metadata viewer",
    "photo exif inspector"
  ],

  tags: ["image", "metadata", "media"],

  component: () => import("./ExifMetadataViewerTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is EXIF metadata?",
      answer:
        "EXIF (Exchangeable Image File Format) metadata is information stored inside photos that describes how and when the image was captured, including camera model, lens settings, exposure, GPS location, and timestamps."
    },
    {
      question: "Are my images uploaded to a server?",
      answer:
        "No. The EXIF data is extracted entirely within your browser using client-side processing. Your images never leave your device."
    },
    {
      question: "Which image formats are supported?",
      answer:
        "Most JPEG images contain EXIF metadata and are fully supported. Some PNG or WebP images may contain limited metadata depending on how they were created."
    }
  ],

  howItWorks:
    "Upload an image file and the tool will instantly read and display all available EXIF metadata including camera information, capture time, technical settings, and GPS location if present.",

  relatedTools: ["image-color-picker", "color-blindness-simulator"],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-06",
};