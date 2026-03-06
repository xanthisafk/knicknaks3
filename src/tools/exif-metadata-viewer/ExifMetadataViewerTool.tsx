import { useState, useRef, useEffect } from "react";

import * as exifr from "exifr";

declare const L: any;

// ═══════════════════════════════════════════════════════════════════════════════
// FILE INTEGRITY / MAGIC BYTE CHECKER
// ═══════════════════════════════════════════════════════════════════════════════

interface FileSignature {
  mime: string;
  ext: string;
  match: (b: Uint8Array) => boolean;
}

const SIGNATURES: FileSignature[] = [
  {
    mime: "image/jpeg", ext: "jpg",
    match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png", ext: "png",
    match: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    mime: "image/gif", ext: "gif",
    match: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
  },
  {
    mime: "image/webp", ext: "webp",
    match: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
      && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  {
    mime: "image/tiff", ext: "tif",
    match: (b) => (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00)
      || (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a),
  },
  {
    mime: "image/bmp", ext: "bmp",
    match: (b) => b[0] === 0x42 && b[1] === 0x4d,
  },
  {
    mime: "image/heic", ext: "heic",
    match: (b) => {
      if (b.length < 12) return false;
      const ftyp = String.fromCharCode(b[4], b[5], b[6], b[7]);
      const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
      return ftyp === "ftyp" && ["heic","heix","mif1","msf1","hevc","hevx"].includes(brand);
    },
  },
  {
    mime: "image/avif", ext: "avif",
    match: (b) => {
      if (b.length < 12) return false;
      const ftyp = String.fromCharCode(b[4], b[5], b[6], b[7]);
      const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
      return ftyp === "ftyp" && ["avif","avis"].includes(brand);
    },
  },
];

interface IntegrityResult {
  ok: boolean;
  detectedMime: string | null;
  detectedExt: string | null;
  claimedMime: string;
  claimedExt: string;
  issues: string[];
  notes: string[];
}

function checkIntegrity(file: File, headerBytes: Uint8Array): IntegrityResult {
  const issues: string[] = [];
  const notes: string[] = [];

  const claimedExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const claimedMime = file.type;

  const sig = SIGNATURES.find((s) => s.match(headerBytes));
  const detectedMime = sig?.mime ?? null;
  const detectedExt = sig?.ext ?? null;

  if (!sig) {
    issues.push("Could not identify file format from magic bytes. The file header is unrecognized or the file may be corrupt.");
  } else {
    const knownExtsForMime: Record<string, string[]> = {
      "image/jpeg": ["jpg","jpeg","jpe","jfif"],
      "image/png": ["png"],
      "image/gif": ["gif"],
      "image/webp": ["webp"],
      "image/tiff": ["tif","tiff"],
      "image/bmp": ["bmp"],
      "image/heic": ["heic","heif"],
      "image/avif": ["avif"],
    };
    const validExts = knownExtsForMime[sig.mime] ?? [sig.ext];
    if (claimedExt && !validExts.includes(claimedExt)) {
      issues.push(`Extension mismatch: file is saved as .${claimedExt} but the container is ${sig.mime} (${sig.ext.toUpperCase()}).`);
    }

    if (claimedMime && claimedMime !== "application/octet-stream" && claimedMime !== sig.mime) {
      const bothJpeg = claimedMime.includes("jpeg") && sig.mime.includes("jpeg");
      const bothTiff = claimedMime.includes("tiff") && sig.mime.includes("tiff");
      if (!bothJpeg && !bothTiff) {
        issues.push(`MIME type mismatch: browser reports "${claimedMime}" but magic bytes indicate "${sig.mime}".`);
      }
    }

    if (sig.mime === "image/heic") notes.push("HEIC files are not displayable in all browsers but EXIF can still be read.");
    if (sig.mime === "image/avif") notes.push("AVIF support varies by browser.");
  }

  if (headerBytes.length < 12) {
    issues.push("File is extremely small and may be empty or truncated.");
  }

  return { ok: issues.length === 0, detectedMime, detectedExt, claimedMime, claimedExt, issues, notes };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RAW / BLOB VALUE DECODER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Try to decode raw binary / base64 / hex values that exifr returns for
 * vendor-specific or unrecognised tags (e.g. "Raw profile type exif").
 * Returns a human-readable string or null if decoding isn't possible.
 */
function tryDecodeRawValue(key: string, val: unknown): string | null {
  // Uint8Array or regular number array that looks like bytes
  const bytes: number[] | null =
    val instanceof Uint8Array
      ? Array.from(val)
      : Array.isArray(val) && val.length > 0 && typeof val[0] === "number" && val[0] <= 255
        ? (val as number[])
        : null;

  if (bytes) {
    // Attempt 1 — treat as UTF-8 text (printable ASCII / UTF-8 heuristic)
    const asText = bytes
      .map((b) => (b >= 0x20 && b < 0x7f) || b >= 0x80 ? String.fromCharCode(b) : null)
      .join("");
    const printableRatio = asText.replace(/[^ -~]/g, "").length / (bytes.length || 1);
    if (printableRatio > 0.85) {
      // Looks like text — try to decode as UTF-8 properly
      try {
        const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
        const trimmed = decoded.replace(/\x00+$/, "").trim();
        if (trimmed.length > 0) return trimmed;
      } catch { /* fall through */ }
    }

    // Attempt 2 — "Raw profile type exif" PNG chunk: text block containing
    // "\nexif\n<length>\n<hex pairs>" — decode the embedded EXIF hex data
    // into a readable summary of byte count + first bytes
    const rawText = bytes.map((b) => String.fromCharCode(b)).join("");
    const profileMatch = rawText.match(/^(\w[\w ]*?)\n\s*(\d+)\n([0-9a-fA-F\s]+)/);
    if (profileMatch) {
      const profileType = profileMatch[1].trim();
      const byteCount = parseInt(profileMatch[2], 10);
      const hexStr = profileMatch[3].replace(/\s/g, "");
      // For exif profiles: first 6 bytes are "Exif\0\0"
      const firstBytes = hexStr.slice(0, 24).replace(/(.{2})/g, "$1 ").trim().toUpperCase();
      return `${profileType} profile · ${byteCount} bytes · [${firstBytes}…]`;
    }

    // Attempt 3 — XMP / XML embedded in bytes
    const xmlCandidate = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
    if (xmlCandidate.includes("<?xpacket") || xmlCandidate.includes("<x:xmpmeta")) {
      // Extract dc:title or xmp:Label or just confirm it's XMP
      const titleMatch = xmlCandidate.match(/<dc:title[^>]*>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/);
      if (titleMatch) return `XMP: ${titleMatch[1].trim()}`;
      return "XMP metadata block";
    }

    // Attempt 4 — ICC profile (starts with 0x00000000 + "acsp" or similar)
    if (bytes.length > 4) {
      const tag = String.fromCharCode(bytes[36] ?? 0, bytes[37] ?? 0, bytes[38] ?? 0, bytes[39] ?? 0);
      if (tag === "acsp") return `ICC color profile · ${bytes.length} bytes`;
    }

    // Attempt 5 — fallback: show byte count + hex preview
    const preview = bytes.slice(0, 16).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    return `${bytes.length} bytes · [${preview}${bytes.length > 16 ? " …" : ""}]`;
  }

  // String value that looks like raw hex dump (e.g. "0a 1b 2c …" or "0A1B2C…")
  if (typeof val === "string") {
    const stripped = val.replace(/\s/g, "");
    if (/^[0-9a-fA-F]{8,}$/.test(stripped) && stripped.length % 2 === 0) {
      // Try to decode as UTF-8 text
      const hexBytes = stripped.match(/.{2}/g)!.map((h) => parseInt(h, 16));
      try {
        const decoded = new TextDecoder("utf-8").decode(new Uint8Array(hexBytes));
        const trimmed = decoded.replace(/\x00/g, "").trim();
        if (trimmed.length > 0 && /[\x20-\x7e]{4,}/.test(trimmed)) return trimmed;
      } catch { /* fall through */ }
      return `${hexBytes.length} bytes · [${stripped.slice(0, 32).replace(/.{2}/g, "$& ").trim().toUpperCase()}${stripped.length > 32 ? " …" : ""}]`;
    }

    // base64 blobs
    if (/^[A-Za-z0-9+/]{16,}={0,2}$/.test(val) && val.length % 4 === 0) {
      try {
        const bin = atob(val);
        const bytes2 = Array.from(bin).map((c) => c.charCodeAt(0));
        const decoded = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes2));
        const printable = decoded.replace(/[^\x20-\x7e\n\r\t]/g, "");
        if (printable.length / val.length > 0.5) return printable.trim();
      } catch { /* fall through */ }
      return `base64 blob · ${val.length} chars`;
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXIF HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const FIELD_SECTIONS: { section: string; icon: string; keys: string[] }[] = [
  {
    section: "File",
    icon: "📄",
    keys: [
      "FileSize", "FileType", "MIMEType",
      "ImageWidth", "ImageHeight",
      "BitDepth", "ColorType", "Compression", "Filter", "Interlace",
      "PixelsPerUnitX", "PixelsPerUnitY", "PixelUnits",
      "ColorComponents", "BitsPerSample", "EncodingProcess",
    ],
  },
  {
    section: "Camera",
    icon: "📷",
    keys: [
      "Make", "Model", "LensModel", "LensMake", "LensInfo",
      "BodySerialNumber", "SerialNumber", "CameraOwnerName", "Software",
    ],
  },
  {
    section: "Settings",
    icon: "⚙️",
    keys: [
      "ExposureTime", "FNumber", "ISO", "ISOSpeedRatings",
      "ExposureProgram", "ExposureMode", "ExposureBiasValue",
      "ShutterSpeedValue", "ApertureValue", "MaxApertureValue",
      "MeteringMode", "Flash", "FocalLength", "FocalLengthIn35mmFormat",
      "WhiteBalance", "DigitalZoomRatio", "SceneCaptureType",
      "Contrast", "Saturation", "Sharpness", "GainControl",
      "SensingMethod", "SubjectDistance", "SubjectDistanceRange",
      "BrightnessValue", "LightSource",
    ],
  },
  {
    section: "Date & Time",
    icon: "🕐",
    keys: [
      "DateTimeOriginal", "CreateDate", "ModifyDate", "DateTime",
      "OffsetTime", "OffsetTimeOriginal", "SubSecTimeOriginal",
      "GPSTimeStamp", "GPSDateStamp",
      "date", "DateCreated", "MetadataDate",
    ],
  },
  {
    section: "Image",
    icon: "🖼️",
    keys: [
      "ImageDescription", "Orientation", "XResolution", "YResolution", "ResolutionUnit",
      "ColorSpace", "YCbCrPositioning", "FlashpixVersion",
      "ExifImageWidth", "ExifImageHeight",
      "ComponentsConfiguration", "CompressedBitsPerPixel",
    ],
  },
  {
    section: "Creator & Rights",
    icon: "✍️",
    keys: [
      "Artist", "Copyright",
      "creator", "Creator", "rights", "Rights",
      "publisher", "Publisher", "title", "Title",
      "description", "Description", "subject", "Subject",
      "format", "Format", "identifier", "Identifier",
      "source", "Source", "language", "Language",
      "UsageTerms", "WebStatement", "Marked", "LicenseUrl",
      "CreatorTool", "Label", "Rating",
      "XMPToolkit",
      "ObjectName", "Caption", "CaptionAbstract",
      "Byline", "BylineTitle", "Credit",
      "CopyrightNotice", "Contact",
      "Keywords", "Category", "SupplementalCategories",
      "Headline", "SpecialInstructions",
      "City", "Province", "CountryName", "CountryCode",
    ],
  },
  {
    section: "GPS",
    icon: "📍",
    keys: [
      "GPSLatitude", "GPSLatitudeRef", "GPSLongitude", "GPSLongitudeRef",
      "GPSAltitude", "GPSAltitudeRef", "GPSSpeed", "GPSSpeedRef",
      "GPSTrack", "GPSTrackRef", "GPSImgDirection", "GPSImgDirectionRef",
      "GPSMapDatum", "GPSSatellites", "GPSDOP", "GPSMeasureMode",
      "GPSStatus", "GPSProcessingMethod",
      // exifr translated decimal keys
      "latitude", "longitude",
    ],
  },
  {
    section: "Advanced",
    icon: "🔬",
    keys: [
      "ExifVersion", "InteropIndex",
      "CFAPattern", "CustomRendered", "FileSource", "SceneType",
      "FocalPlaneXResolution", "FocalPlaneYResolution", "FocalPlaneResolutionUnit",
      "ExposureIndex", "SubjectArea", "UserComment", "ImageUniqueID",
    ],
  },
  { section: "Other", icon: "🗂️", keys: [] },
];

const ALL_KNOWN_KEYS = new Set(FIELD_SECTIONS.flatMap((s) => s.keys));

function formatValue(key: string, val: unknown): string {
  if (val === null || val === undefined) return "";
  if (val instanceof Date) return val.toLocaleString();

  // Try to decode raw binary / blob values before anything else
  if (val instanceof Uint8Array || (Array.isArray(val) && val.length > 0 && typeof val[0] === "number" && val[0] <= 255 && !["GPSLatitude","GPSLongitude","LensInfo","SubjectArea","CFAPattern"].includes(key))) {
    const decoded = tryDecodeRawValue(key, val);
    if (decoded) return decoded;
  }
  if (typeof val === "string" && val.length > 20) {
    const decoded = tryDecodeRawValue(key, val);
    if (decoded && decoded !== val) return decoded;
  }

  if (key === "ExposureTime" && typeof val === "number") {
    return val >= 1 ? `${val.toFixed(1)}s` : `1/${Math.round(1 / val)}s`;
  }
  if (key === "FNumber" && typeof val === "number") return `f/${val.toFixed(1)}`;
  if ((key === "FocalLength" || key === "FocalLengthIn35mmFormat") && typeof val === "number") {
    return `${val.toFixed(1)} mm`;
  }
  if (key === "ExposureBiasValue" && typeof val === "number") {
    return `${val >= 0 ? "+" : ""}${val.toFixed(2)} EV`;
  }
  if ((key === "XResolution" || key === "YResolution") && typeof val === "number") {
    return `${Math.round(val)} dpi`;
  }
  if (key === "DigitalZoomRatio" && typeof val === "number") {
    return val === 0 || val === 1 ? "None" : `${val.toFixed(2)}×`;
  }
  if (key === "GPSAltitude" && typeof val === "number") return `${val.toFixed(1)} m`;
  if (key === "GPSSpeed" && typeof val === "number") return `${val.toFixed(1)} km/h`;
  if (key === "FileSize" && typeof val === "number") {
    return val > 1_000_000 ? `${(val / 1_000_000).toFixed(2)} MB`
      : val > 1_000 ? `${(val / 1_000).toFixed(1)} KB` : `${val} B`;
  }
  if ((key === "GPSLatitude" || key === "GPSLongitude" || key === "latitude" || key === "longitude") && typeof val === "number") {
    return `${val.toFixed(6)}°`;
  }
  if ((key === "GPSLatitude" || key === "GPSLongitude") && Array.isArray(val)) {
    const [d, m, s] = val as number[];
    return `${Math.floor(d)}° ${Math.floor(m)}' ${(s ?? 0).toFixed(2)}"`;
  }

  if (Array.isArray(val)) return val.map((v) => formatValue("", v)).join(", ");
  if (typeof val === "number") return Number.isInteger(val) ? String(val) : val.toFixed(4).replace(/\.?0+$/, "");
  return String(val);
}

function buildFileFields(file: File, parsed: Record<string, unknown>): Record<string, unknown> {
  return {
    FileSize: file.size,
    FileType: file.name.split(".").pop()?.toUpperCase() ?? "Unknown",
    MIMEType: file.type || "unknown",
    ImageWidth: parsed.ImageWidth ?? parsed.ExifImageWidth ?? parsed.PixelXDimension ?? null,
    ImageHeight: parsed.ImageHeight ?? parsed.ExifImageHeight ?? parsed.PixelYDimension ?? null,
    BitDepth: parsed.BitDepth ?? null,
    ColorType: parsed.ColorType ?? null,
    Compression: parsed.Compression ?? null,
    Filter: parsed.Filter ?? null,
    Interlace: parsed.Interlace ?? null,
    PixelsPerUnitX: parsed.PixelsPerUnitX ?? null,
    PixelsPerUnitY: parsed.PixelsPerUnitY ?? null,
    PixelUnits: parsed.PixelUnits ?? null,
    ColorComponents: parsed.ColorComponents ?? null,
    BitsPerSample: parsed.BitsPerSample ?? null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GPS COORDINATE EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

function extractGpsCoords(data: Record<string, unknown>): { lat: number; lon: number } | null {
  // exifr with translateValues:true provides top-level decimal `latitude` / `longitude`
  if (typeof data.latitude === "number" && typeof data.longitude === "number"
    && !isNaN(data.latitude) && !isNaN(data.longitude)) {
    return { lat: data.latitude, lon: data.longitude };
  }

  // Fallback: raw GPSLatitude / GPSLongitude (may be decimal or DMS array)
  const rawLat = data.GPSLatitude;
  const rawLon = data.GPSLongitude;
  const latRef = (data.GPSLatitudeRef as string) ?? "N";
  const lonRef = (data.GPSLongitudeRef as string) ?? "E";

  let latN: number | null = null;
  let lonN: number | null = null;

  if (typeof rawLat === "number") latN = rawLat;
  else if (Array.isArray(rawLat) && rawLat.length >= 2) {
    latN = (rawLat[0] as number) + (rawLat[1] as number) / 60 + ((rawLat[2] as number) ?? 0) / 3600;
  }

  if (typeof rawLon === "number") lonN = rawLon;
  else if (Array.isArray(rawLon) && rawLon.length >= 2) {
    lonN = (rawLon[0] as number) + (rawLon[1] as number) / 60 + ((rawLon[2] as number) ?? 0) / 3600;
  }

  if (latN !== null && lonN !== null && !isNaN(latN) && !isNaN(lonN)) {
    return {
      lat: latRef.toUpperCase() === "S" ? -Math.abs(latN) : Math.abs(latN),
      lon: lonRef.toUpperCase() === "W" ? -Math.abs(lonN) : Math.abs(lonN),
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-default)] ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, count, open, onToggle }: {
  icon: string; title: string; count: number; open: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-bg)] transition-colors text-left"
    >
      <span>{icon}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)] flex-1">{title}</span>
      <span className="text-[11px] text-[var(--text-tertiary)] mr-1">{count} field{count !== 1 ? "s" : ""}</span>
      <span className="text-[var(--text-tertiary)] text-xs">{open ? "▾" : "▸"}</span>
    </button>
  );
}

function EntryRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--border-default)] last:border-0 group">
      <span className="text-xs text-[var(--text-tertiary)] w-44 flex-shrink-0 pt-px leading-snug">{label}</span>
      <span className="text-xs text-[var(--text-primary)] font-mono flex-1 break-all leading-snug">{value}</span>
      <button
        onClick={() => navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1300); })}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-all"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

// ─── Leaflet map ──────────────────────────────────────────────────────────────

function GpsMap({ lat, lon }: { lat: number; lon: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if ((window as any).L) {
      setLeafletReady(true);
      return;
    }

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS from cdnjs (more reliable than unpkg)
    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => setLeafletReady(true);
      script.onerror = () => setLoadError(true);
      document.head.appendChild(script);
    } else {
      // Script tag exists but may still be loading — poll for L
      const poll = setInterval(() => {
        if ((window as any).L) {
          setLeafletReady(true);
          clearInterval(poll);
        }
      }, 100);
      setTimeout(() => { clearInterval(poll); setLoadError(true); }, 8000);
    }
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Custom div marker — avoids broken default icon asset path
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        width: 28px; height: 28px;
        background: #f59e0b;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    L.marker([lat, lon], { icon })
      .addTo(map)
      .bindPopup(`<b>${lat.toFixed(6)}°, ${lon.toFixed(6)}°</b>`)
      .openPopup();

    mapInstanceRef.current = map;

    // Force a size recalculation after mount (needed when container was hidden)
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady, lat, lon]);

  const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
          📍 Location
        </h3>
        <div className="flex gap-2">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors">
            Open in Google Maps ↗
          </a>
          <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=14`} target="_blank" rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors">
            OpenStreetMap ↗
          </a>
        </div>
      </div>

      {/* Coordinates display */}
      <div className="flex gap-4 mb-3">
        <div className="flex-1 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] px-3 py-2">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">Latitude</p>
          <p className="text-sm font-mono text-[var(--text-primary)]">{lat.toFixed(6)}°</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">{lat >= 0 ? "N" : "S"}</p>
        </div>
        <div className="flex-1 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] px-3 py-2">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">Longitude</p>
          <p className="text-sm font-mono text-[var(--text-primary)]">{lon.toFixed(6)}°</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">{lon >= 0 ? "E" : "W"}</p>
        </div>
        <div className="flex-1 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] px-3 py-2">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">DMS</p>
          <p className="text-[11px] font-mono text-[var(--text-primary)] leading-snug">
            {Math.floor(Math.abs(lat))}°{Math.floor((Math.abs(lat) % 1) * 60)}'{((Math.abs(lat) * 3600) % 60).toFixed(1)}" {lat >= 0 ? "N" : "S"}
          </p>
          <p className="text-[11px] font-mono text-[var(--text-primary)] leading-snug">
            {Math.floor(Math.abs(lon))}°{Math.floor((Math.abs(lon) % 1) * 60)}'{((Math.abs(lon) * 3600) % 60).toFixed(1)}" {lon >= 0 ? "E" : "W"}
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="h-64 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] flex flex-col items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]">
          <span>⚠️ Map could not load</span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[var(--color-primary-500)] underline">View on Google Maps instead ↗</a>
        </div>
      ) : !leafletReady ? (
        <div className="h-64 rounded-[var(--radius-md)] bg-[var(--surface-bg)] border border-[var(--border-default)] flex items-center justify-center text-sm text-[var(--text-tertiary)]">
          Loading map…
        </div>
      ) : (
        <div
          ref={mapRef}
          style={{ height: "256px", width: "100%", zIndex: 0 }}
          className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)]"
        />
      )}
    </div>
  );
}

// ─── Integrity badge ──────────────────────────────────────────────────────────

function IntegrityBadge({ result }: { result: IntegrityResult }) {
  if (result.ok && result.notes.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
        ✓ File OK
      </span>
    );
  }
  if (result.issues.length > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
        ⚠ Integrity issue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
      ℹ Note
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TOOL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ExifMetadataViewerTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(FIELD_SECTIONS.map((s) => s.section))
  );
  const [copyAllDone, setCopyAllDone] = useState(false);

  const [parsed, setParsed] = useState<Record<string, unknown> | null>(null);
  const [integrity, setIntegrity] = useState<IntegrityResult | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setWarning(null);
    setParsed(null);
    setIntegrity(null);
    setGpsCoords(null);

    setImageName(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const headerBuffer = await file.slice(0, 32).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);
    const integrityResult = checkIntegrity(file, headerBytes);
    setIntegrity(integrityResult);

    try {
      const data = await exifr.parse(file, {
        tiff: true,
        xmp: true,
        iptc: true,
        icc: false,
        jfif: true,
        ihdr: true,
        ifd0: true,
        ifd1: false,
        exif: true,
        gps: true,
        interop: false,
        mergeOutput: true,
        translateValues: true,
        translateKeys: true,
        reviveValues: true,
        sanitize: true,
      }) as Record<string, unknown> | undefined;

      const fileFields = buildFileFields(file, data ?? {});

      if (!data || Object.keys(data).length === 0) {
        setWarning("No metadata found. The image may not have any embedded metadata, or it may have been stripped by an editor or social platform.");
        setParsed(fileFields);
      } else {
        const merged = { ...fileFields, ...data };
        setParsed(merged);

        // Extract GPS using dedicated helper
        const coords = extractGpsCoords(data);
        if (coords) setGpsCoords(coords);
      }
    } catch (err) {
      setWarning(`Failed to read metadata: ${err}`);
      setParsed(buildFileFields(file, {}));
    }

    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setImageUrl(null);
    setImageName("");
    setParsed(null);
    setIntegrity(null);
    setGpsCoords(null);
    setWarning(null);
    setSearch("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSection = (s: string) =>
    setOpenSections((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const sectionRows = (keys: string[], section?: string): { label: string; value: string }[] => {
    if (!parsed) return [];

    const effectiveKeys = section === "Other"
      ? Object.keys(parsed).filter((k) => !ALL_KNOWN_KEYS.has(k))
      : keys;

    return effectiveKeys.flatMap((key) => {
      const val = parsed[key];
      if (val === null || val === undefined || val === "") return [];

      // For "Other" section: try to decode blobs; skip truly undecodeable binary
      if (section === "Other") {
        const isBlob = val instanceof Uint8Array
          || (Array.isArray(val) && val.length > 4 && typeof val[0] === "number" && val[0] <= 255);
        if (isBlob) {
          const decoded = tryDecodeRawValue(key, val);
          if (!decoded) return []; // skip unrenderable blobs
          const label = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^([a-z])/, (c) => c.toUpperCase()).trim();
          if (search) {
            const q = search.toLowerCase();
            if (!label.toLowerCase().includes(q) && !decoded.toLowerCase().includes(q)) return [];
          }
          return [{ label, value: decoded }];
        }
      }

      if (typeof val === "object" && !(val instanceof Date) && !Array.isArray(val) && !(val instanceof Uint8Array)) return [];

      const formatted = formatValue(key, val);
      if (!formatted || formatted === "[object Object]") return [];

      const label = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^([a-z])/, (c) => c.toUpperCase())
        .trim();

      if (search) {
        const q = search.toLowerCase();
        if (!label.toLowerCase().includes(q) && !formatted.toLowerCase().includes(q)) return [];
      }
      return [{ label, value: formatted }];
    });
  };

  const copyAll = () => {
    if (!parsed) return;
    const lines: string[] = [];
    for (const { section, keys } of FIELD_SECTIONS) {
      const rows = sectionRows(keys, section);
      if (rows.length > 0) {
        lines.push(`── ${section} ──`);
        rows.forEach(({ label, value }) => lines.push(`${label}: ${value}`));
        lines.push("");
      }
    }
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopyAllDone(true);
      setTimeout(() => setCopyAllDone(false), 1500);
    });
  };

  const totalVisible = FIELD_SECTIONS.reduce((n, s) => n + sectionRows(s.keys, s.section).length, 0);

  return (
    <div className="space-y-5">

      {/* Upload zone */}
      {!imageUrl ? (
        <Panel className="p-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[var(--radius-lg)] p-14 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
              dragging
                ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/5"
                : "border-[var(--border-default)] hover:border-[var(--color-primary-500)]/60 hover:bg-[var(--surface-bg)]"
            }`}
          >
            <span className="text-5xl">📷</span>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">Drop a photo here, or click to browse</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">JPEG, PNG, WEBP, TIFF, HEIC — processed entirely in your browser</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        </Panel>
      ) : (
        <>
          {/* ── Header bar ── */}
          <Panel className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] bg-[var(--surface-bg)]">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-xs">{imageName}</p>
                  {integrity && <IntegrityBadge result={integrity} />}
                </div>
                {parsed && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {parsed.ImageWidth && parsed.ImageHeight
                      ? `${parsed.ImageWidth} × ${parsed.ImageHeight}px · ` : ""}
                    {parsed.FileSize ? formatValue("FileSize", parsed.FileSize) : ""}
                    {gpsCoords ? " · GPS available" : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {parsed && (
                  <button onClick={copyAll}
                    className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors">
                    {copyAllDone ? "✓ Copied" : "Copy all"}
                  </button>
                )}
                <button onClick={reset}
                  className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-500)] transition-colors">
                  ↩ New file
                </button>
              </div>
            </div>
          </Panel>

          {/* ── Integrity issues ── */}
          {integrity && (integrity.issues.length > 0 || integrity.notes.length > 0) && (
            <Panel className="p-4">
              <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-2">File Integrity</p>
              {integrity.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-500 mb-1.5">
                  <span className="flex-shrink-0 mt-px">⚠️</span>
                  <span>{issue}</span>
                </div>
              ))}
              {integrity.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 mt-px">ℹ️</span>
                  <span>{note}</span>
                </div>
              ))}
              {integrity.detectedMime && (
                <p className="text-xs text-[var(--text-tertiary)] mt-2 font-mono">
                  Detected: {integrity.detectedMime} (.{integrity.detectedExt})
                  {integrity.claimedMime ? ` · Claimed: ${integrity.claimedMime}` : ""}
                </p>
              )}
            </Panel>
          )}

          {/* ── Loading ── */}
          {loading && (
            <Panel className="p-5">
              <div className="flex items-center justify-center gap-3 py-4">
                <svg className="animate-spin w-5 h-5 text-[var(--color-primary-500)]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                <span className="text-sm text-[var(--text-secondary)]">Reading metadata…</span>
              </div>
            </Panel>
          )}

          {/* ── Warning ── */}
          {!loading && warning && (
            <Panel className="p-4">
              <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="flex-shrink-0">⚠️</span>
                <span>{warning}</span>
              </div>
            </Panel>
          )}

          {/* ── GPS Map ── */}
          {!loading && gpsCoords && (
            <Panel className="p-5">
              <GpsMap lat={gpsCoords.lat} lon={gpsCoords.lon} />
            </Panel>
          )}

          {/* ── Search ── */}
          {!loading && parsed && (
            <Panel className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-tertiary)] text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Filter fields…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
                {search && (
                  <>
                    <span className="text-[11px] text-[var(--text-tertiary)]">{totalVisible} match{totalVisible !== 1 ? "es" : ""}</span>
                    <button onClick={() => setSearch("")}
                      className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-xs transition-colors ml-1">✕</button>
                  </>
                )}
              </div>
            </Panel>
          )}

          {/* ── Metadata sections ── */}
          {!loading && parsed && FIELD_SECTIONS.map(({ section, icon, keys }) => {
            const rows = sectionRows(keys, section);
            const unfiltered = (() => {
              if (!parsed) return 0;
              const effectiveKeys = section === "Other"
                ? Object.keys(parsed).filter((k) => !ALL_KNOWN_KEYS.has(k))
                : keys;
              return effectiveKeys.filter((k) => {
                const v = parsed[k];
                if (v === null || v === undefined || v === "") return false;
                if (section === "Other") {
                  const isBlob = v instanceof Uint8Array
                    || (Array.isArray(v) && v.length > 4 && typeof v[0] === "number" && v[0] <= 255);
                  if (isBlob) return !!tryDecodeRawValue(k, v);
                }
                if (typeof v === "object" && !(v instanceof Date) && !Array.isArray(v) && !(v instanceof Uint8Array)) return false;
                const f = formatValue(k, v);
                return !!f && f !== "[object Object]";
              }).length;
            })();
            if (unfiltered === 0) return null;
            const isOpen = openSections.has(section);

            return (
              <Panel key={section} className="overflow-hidden">
                <SectionHeader
                  icon={icon} title={section}
                  count={search ? rows.length : unfiltered}
                  open={isOpen}
                  onToggle={() => toggleSection(section)}
                />
                {isOpen && (
                  <div className="px-5 pb-2">
                    {rows.length > 0
                      ? rows.map((r) => <EntryRow key={r.label} label={r.label} value={r.value} />)
                      : <p className="text-xs text-[var(--text-tertiary)] py-3 italic">No matching fields.</p>
                    }
                  </div>
                )}
              </Panel>
            );
          })}
        </>
      )}

      {/* ── Info ── */}
      <Panel className="p-5">
        <p className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">About EXIF</p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          EXIF data is embedded in photos by cameras and phones at capture time. It can include camera model, lens, exposure settings, GPS coordinates, and timestamps. Many social platforms strip this on upload. All parsing happens locally — your images never leave your device.
        </p>
      </Panel>
    </div>
  );
}