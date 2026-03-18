import { useState, useRef } from "react";
import * as exifr from "exifr";
import { Panel } from "@/components/layout";
import { IntegrityBadge } from "./IntegrityBadge";
import { SectionHeader } from "./SectionHeader";
import { GpsMap } from "@/components/advanced/GpsMap";
import { ALL_KNOWN_KEYS, FIELD_SECTIONS, buildFileFields, checkIntegrity, extractGpsCoords, formatValue, tryDecodeRawValue, type IntegrityResult } from "@/lib/imageHelper";
import { ResultRow } from "@/components/advanced/ResultRow";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, Copy, CornerDownLeft, Loader2, Search, X } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";


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
        ifd0: {},
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
    <div className="space-y-2">

      {/* Upload zone */}
      {!imageUrl ? (
        <FileDropZone accepts="image/*" emoji="📷" onUpload={e => handleFile(e.file)} />

      ) : (
        <>
          {/* ── Header bar ── */}
          <Panel className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden border border-(--border-default) bg-(--surface-bg)">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-(--text-primary) truncate max-w-xs">{imageName}</p>
                  {integrity && <IntegrityBadge result={integrity} />}
                </div>
                {parsed && (
                  <p className="text-xs text-(--text-tertiary) mt-0.5">
                    {parsed.ImageWidth && parsed.ImageHeight
                      ? `${parsed.ImageWidth} x ${parsed.ImageHeight}px · ` : ""}
                    {parsed.FileSize ? formatValue("FileSize", parsed.FileSize) : ""}
                    {gpsCoords ? " · GPS available" : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {parsed && (
                  <Button
                    onClick={copyAll}
                    variant="ghost"
                    icon={copyAllDone ? Check : Copy}
                    size="sm"
                  >
                    {copyAllDone ? "Copied" : "Copy all"}
                  </Button>
                )}
                <Button
                  onClick={reset}
                  variant="secondary"
                  icon={CornerDownLeft}
                  size="sm"
                >
                  New file
                </Button>
              </div>
            </div>
          </Panel>

          {/* ── Integrity issues ── */}
          {integrity && (integrity.issues.length > 0 || integrity.notes.length > 0) && (
            <Panel className="p-4">
              <p className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-2">File Integrity</p>
              {integrity.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-500 mb-1.5">
                  <span className="shrink-0 mt-px font-emoji">⚠️</span>
                  <span>{issue}</span>
                </div>
              ))}
              {integrity.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-(--text-secondary)">
                  <span className="shrink-0 mt-px font-emoji">ℹ️</span>
                  <span>{note}</span>
                </div>
              ))}
              {integrity.detectedMime && (
                <p className="text-xs text-(--text-tertiary) mt-2 font-mono">
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
                <Loader2 className="animate-spin w-5 h-5 text-primary-500" />
                <span className="text-sm text-(--text-secondary)">Reading metadata...</span>
              </div>
            </Panel>
          )}

          {/* ── Warning ── */}
          {!loading && warning && (
            <Panel className="p-4">
              <div className="flex items-start gap-2 text-sm text-(--text-secondary)">
                <span className="shrink-0 font-emoji">⚠️</span>
                <span>{warning}</span>
              </div>
            </Panel>
          )}

          {/* ── GPS Map ── */}
          {!loading && gpsCoords && (
            <Panel>
              <GpsMap lat={gpsCoords.lat} lon={gpsCoords.lon} />
            </Panel>
          )}


          {/* ── Metadata sections ── */}
          <Panel className="overflow-hidden space-y-2">
            {!loading && parsed && <>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Filter fields..."
                  value={search}
                  leadingIcon={Search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-(--text-primary) placeholder:text-(--text-tertiary)"
                />
                {search && (
                  <>
                    <Button
                      variant="ghost"
                      icon={X}
                      onClick={() => setSearch("")}
                      title="Clear search"
                    />
                  </>
                )}
              </div>
              {search &&
                <Label>{totalVisible} match{totalVisible !== 1 ? "es" : ""}</Label>
              }
            </>}
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
              if (search && rows.length === 0) return null;
              const isOpen = openSections.has(section);

              return (<div className="hover:bg-(--surface-bg) rounded-md border border-(--border-default) mb-2">
                <SectionHeader
                  icon={icon} title={section}
                  count={search ? rows.length : unfiltered}
                  open={isOpen}
                  onToggle={() => toggleSection(section)}
                />
                {isOpen && (
                  <div className="px-5 pb-2 flex flex-col gap-1">
                    {rows.length > 0
                      ? rows.map((r) => <ResultRow key={r.label} label={r.label} value={r.value} />)
                      : <p className="text-xs text-(--text-tertiary) py-3 italic">No matching fields.</p>
                    }
                  </div>
                )}

              </div>);
            })}
          </Panel>

        </>
      )}
    </div>
  );
}