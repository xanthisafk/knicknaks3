export default function formatMime(accept: string): string {
  if (!accept) return "All files";

  const parts = accept
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (parts.includes("*") || parts.includes("*/*")) {
    return "All files";
  }

  const labels = new Set();

  for (const part of parts) {
    // category wildcards
    if (part.endsWith("/*")) {
      const type = part.split("/")[0];
      labels.add(`All ${type}s`);
      continue;
    }

    // file extension
    if (part.startsWith(".")) {
      labels.add(part.slice(1).toUpperCase());
      continue;
    }

    // mime type
    if (part.includes("/")) {
      const subtype = part.split("/")[1];
      if (subtype) labels.add(subtype.toUpperCase());
      continue;
    }
  }

  return [...labels].join(", ");
}