import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "EXIF Metadata Viewer",
  slug: "exif-metadata-viewer",
  description:
    "View and inspect EXIF metadata from photos directly in your browser.",
  category: "media",
  featured: true,
  icon: "📷",

  keywords: [
    "exif viewer",
    "image metadata viewer",
    "photo metadata viewer",
    "view exif data online",
    "check photo gps metadata",
    "image exif reader",
    "camera metadata viewer",
    "photo exif inspector",
    "exif data checker",
    "image metadata reader",
    "photo exif data viewer",
    "view camera settings from photo"
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
        "EXIF (Exchangeable Image File Format) metadata is information embedded inside image files that records details about how the photo was captured. This can include camera model, lens type, shutter speed, aperture, ISO, date and time, and sometimes GPS location."
    },
    {
      question: "What information can this tool extract?",
      answer:
        "The viewer can display camera model, lens information, shutter speed, aperture, ISO, focal length, capture date and time, orientation, image dimensions, and GPS coordinates if they exist in the file."
    },
    {
      question: "Are my images uploaded to a server?",
      answer:
        "No. All metadata extraction happens locally in your browser. Your images never leave your device, ensuring complete privacy."
    },
    {
      question: "Which image formats are supported?",
      answer:
        "JPEG images most commonly contain EXIF metadata and are fully supported. Some PNG, HEIC, or WebP images may include limited metadata depending on how they were generated."
    },
    {
      question: "Why doesn't my photo show any EXIF data?",
      answer:
        "Some apps and social media platforms remove metadata to reduce file size or protect privacy. If the metadata was stripped before uploading or sharing, it cannot be recovered."
    },
    {
      question: "Can I see the GPS location where a photo was taken?",
      answer:
        "If the camera or smartphone recorded GPS coordinates and they were not removed later, the tool will display the latitude and longitude stored in the image metadata."
    },
    {
      question: "Do all cameras store EXIF metadata?",
      answer:
        "Most digital cameras and smartphones automatically embed EXIF metadata when taking photos. However, some editing software may remove or overwrite parts of the metadata."
    },
    {
      question: "Can I check camera settings used for a photo?",
      answer:
        "Yes. EXIF metadata often contains the exact camera settings used when the photo was taken, including aperture (f-stop), shutter speed, ISO sensitivity, and focal length."
    },
    {
      question: "Does editing a photo remove EXIF metadata?",
      answer:
        "Some image editing tools preserve metadata while others remove it when exporting the image. The presence of EXIF data depends on how the file was processed."
    },
    {
      question: "Can this tool help verify if a photo is original?",
      answer:
        "EXIF metadata can provide clues about when and how a photo was taken. However, metadata can be edited or removed, so it should not be considered absolute proof of authenticity."
    },
    {
      question: "Is this tool useful for photographers?",
      answer:
        "Yes. Photographers often review EXIF data to study camera settings used in successful shots and learn how exposure parameters affect image results."
    },
    {
      question: "Can developers use this tool?",
      answer:
        "Developers can inspect metadata structure inside images to better understand how cameras and software embed EXIF information."
    },
    {
      question: "Does the tool work offline?",
      answer:
        "Yes. Once the page is loaded, the metadata extraction runs entirely in your browser and can continue working without an internet connection."
    }
  ],

  howItWorks:
    "Upload or drag an image file into the viewer and the tool immediately scans the file for embedded EXIF metadata. The metadata is parsed directly within your browser using client-side processing. All available fields are then organized into readable sections such as camera information, image properties, capture settings, timestamps, and GPS data. If GPS coordinates are present, they will be displayed as latitude and longitude values. Because the analysis happens locally, you can safely inspect photos without uploading them to any external server.",

  relatedTools: ["image-color-picker", "color-blindness-simulator"],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-19",
};