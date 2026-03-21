import { useEffect, useRef, useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, CornerDownLeft, Loader2, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toTitleCase } from "@/lib";

// ── Types ───────────────────────────────────────────────────────────────────
type VPos = "top" | "bottom";
type HPos = "left" | "center" | "right";
type PaddingSize = "small" | "medium" | "large";
type Status = { type: "error" | "success" | "info"; message: string } | null;

// ── Number helpers ───────────────────────────────────────────────────────────
function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  vals.forEach((v, i) => { while (n >= v) { result += syms[i]; n -= v; } });
  return result || "0";
}

function toOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const WORD_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const WORD_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function toWord(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "minus " + toWord(-n);
  if (n < 20) return WORD_ONES[n];
  if (n < 100) return WORD_TENS[Math.floor(n / 10)] + (n % 10 ? "-" + WORD_ONES[n % 10] : "");
  if (n < 1000) return WORD_ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + toWord(n % 100) : "");
  return n.toString();
}

// ── Template engine ──────────────────────────────────────────────────────────
function resolveTemplate(template: string, page: number, total: number): string {
  return template
    .replace(/\{n\}/g, String(page))
    .replace(/\{total\}/g, String(total))
    .replace(/\{roman\}/g, toRoman(page).toLowerCase())
    .replace(/\{ROMAN\}/g, toRoman(page))
    .replace(/\{word\}/g, toWord(page))
    .replace(/\{ord\}/g, toOrdinal(page));
}

// ── Presets ──────────────────────────────────────────────────────────────────
interface Preset { label: string; template: string; }

const PRESETS: Preset[] = [
  { label: "1", template: "{n}" },
  { label: "[1]", template: "[{n}]" },
  { label: "— 1 —", template: "— {n} —" },
  { label: "· 1 ·", template: "· {n} ·" },
  { label: "-1-", template: "-{n}-" },
  { label: "i  (roman lowercase)", template: "{roman}" },
  { label: "I  (roman uppercase)", template: "{ROMAN}" },
  { label: "one  (word)", template: "{word}" },
  { label: "1st  (ordinal)", template: "{ord}" },
  { label: "Pg. 1", template: "Pg. {n}" },
  { label: "P.1", template: "P.{n}" },
  { label: "1 / N", template: "{n} / {total}" },
  { label: "Page 1 of N", template: "Page {n} of {total}" },
  { label: "Pg 1 of N", template: "Pg {n} of {total}" },
];

const TEMPLATE_VARS = [
  { token: "{n}", hint: "Current page number" },
  { token: "{total}", hint: "Total page count" },
  { token: "{roman}", hint: "Lowercase roman numeral (e.g. iv)" },
  { token: "{ROMAN}", hint: "Uppercase roman numeral (e.g. IV)" },
  { token: "{word}", hint: "Number spelled out (e.g. four)" },
  { token: "{ord}", hint: "Ordinal suffix (e.g. 4th)" },
];

// ── Font options ─────────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { label: "Outfit (heading)", value: "Outfit, system-ui, sans-serif" },
  { label: "Inter (body)", value: "Inter, system-ui, sans-serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', ui-monospace, monospace" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Palatino", value: "'Palatino Linotype', Palatino, serif" },
  { label: "Garamond", value: "Garamond, serif" },
];

// Mapping font-family string → closest StandardFont for pdf-lib
function getPdfFont(fontFamily: string): string {
  const f = fontFamily.toLowerCase();
  if (f.includes("jetbrains") || f.includes("courier") || f.includes("mono")) return "Courier";
  if (f.includes("times") || f.includes("georgia") || f.includes("palatino") || f.includes("garamond")) return "TimesRoman";
  return "Helvetica";
}



// ── Padding map ───────────────────────────────────────────────────────────────
const PADDING_MAP: Record<PaddingSize, { css: string; pdf: number }> = {
  small: { css: "2px 6px", pdf: 2 },
  medium: { css: "4px 10px", pdf: 5 },
  large: { css: "8px 18px", pdf: 10 },
};

// ── Radius map ────────────────────────────────────────────────────────────────
const RADIUS_OPTIONS = [
  { label: "None", value: "0px" },
  { label: "Small", value: "4px" },
  { label: "Medium", value: "8px" },
  { label: "Large", value: "16px" },
  { label: "Full", value: "999px" },
];

const MARGIN = 36;

// Helper function - add this outside your component
function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const clampedR = Math.min(r, w / 2, h / 2);
  // Build relative to 0,0 — caller passes absolute x/y to drawSvgPath options
  return [
    `M ${clampedR} 0`,
    `L ${w - clampedR} 0`,
    `Q ${w} 0 ${w} ${clampedR}`,
    `L ${w} ${h - clampedR}`,
    `Q ${w} ${h} ${w - clampedR} ${h}`,
    `L ${clampedR} ${h}`,
    `Q 0 ${h} 0 ${h - clampedR}`,
    `L 0 ${clampedR}`,
    `Q 0 0 ${clampedR} 0`,
    `Z`,
  ].join(" ");
}

// Helper to parse your CSS px string to a number
function parsePx(val: string): number {
  return parseInt(val, 10) || 0;
}

// ── hex → rgb 0-1 ──────────────────────────────────────────────────────────
function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [vPos, setVPos] = useState<VPos>("bottom");
  const [hPos, setHPos] = useState<HPos>("center");
  const [fontSize, setFontSize] = useState(12);
  const [startNum, setStartNum] = useState(1);
  const [template, setTemplate] = useState("{n}");
  const [outputName, setOutputName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // New style options
  const [fontColor, setFontColor] = useState("#4d4d4d");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgEnabled, setBgEnabled] = useState(false); // transparent by default
  const [borderRadius, setBorderRadius] = useState("0px");
  const [padding, setPadding] = useState<PaddingSize>("small");
  const [fontFamily, setFontFamily] = useState("Helvetica, Arial, sans-serif");

  const fileRef = useRef<File | null>(null);

  // ── File load ──────────────────────────────────────────────────────────────
  const handleFile = async (incoming: File) => {
    setIsLoadingFile(true);
    setFile(incoming);
    fileRef.current = incoming;
    setStatus(null);
    const baseName = incoming.name.replace(/\.pdf$/i, "");
    setOutputName(`${baseName}-numbered`);
    try {
      const buffer = await incoming.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Could not read PDF." });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const reset = () => {
    setFile(null);
    fileRef.current = null;
    setPageCount(0);
    setStatus(null);
    setOutputName("");
  };

  const insertToken = (token: string) => setTemplate(prev => prev + token);

  // ── Preview label text ───────────────────────────────────────────────────
  const previewText = resolveTemplate(template, startNum, pageCount || 1);

  // ── Computed preview styles ───────────────────────────────────────────────
  const labelStyle: React.CSSProperties = {
    fontFamily,
    fontSize: `${fontSize}px`,
    color: fontColor,
    backgroundColor: bgEnabled ? bgColor : "transparent",
    borderRadius,
    padding: PADDING_MAP[padding].css,
    lineHeight: 1,
    display: "inline-block",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  };

  // Position alignment in the document preview
  const rowJustify =
    hPos === "left" ? "flex-start" :
      hPos === "right" ? "flex-end" : "center";

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleAddNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatus({ type: "info", message: "Adding page numbers..." });

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const fontKey = getPdfFont(fontFamily);
      const stdFont =
        fontKey === "Courier" ? StandardFonts.Courier :
          fontKey === "TimesRoman" ? StandardFonts.TimesRoman :
            StandardFonts.Helvetica;

      const font = await pdf.embedFont(stdFont);
      const pages = pdf.getPages();
      const total = pages.length;
      const [fr, fg, fb] = hexToRgb01(fontColor);
      const [br, bg_r, bb] = hexToRgb01(bgColor);
      const padPdf = PADDING_MAP[padding].pdf;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = resolveTemplate(template, startNum + i, startNum + total - 1);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        let x: number;
        if (hPos === "left") x = MARGIN;
        else if (hPos === "right") x = width - MARGIN - textWidth;
        else x = (width - textWidth) / 2;

        const y = vPos === "bottom" ? MARGIN : height - MARGIN - textHeight;

        // Draw background rect if enabled
        if (bgEnabled) {
          const rx = parsePx(borderRadius);
          const descender = fontSize * 0.2; // ~20% of font size sits below baseline
          const bx = x - padPdf;
          const by = y - descender - padPdf;
          const bw = textWidth + padPdf * 2;
          const bh = textHeight + padPdf * 2;

          if (rx === 0) {
            // No radius — keep the simple rect for performance
            page.drawRectangle({
              x: bx,
              y: by,
              width: bw,
              height: bh,
              color: rgb(br, bg_r, bb),
            });
          } else {
            // "Full" pill: clamp radius to half the shorter side
            const effectiveR = borderRadius === "999px" ? Math.min(bw, bh) / 2 : rx;
            page.drawSvgPath(roundedRectPath(0, 0, bw, bh, effectiveR), {
              x: bx,
              y: by,
              color: rgb(br, bg_r, bb),
            });
          }
        }

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(fr, fg, fb) });
      });

      const bytes = await pdf.save();
      const fileName = (outputName.trim() || "numbered") + ".pdf";
      downloadPdf(bytes, fileName);
      setStatus({ type: "success", message: `Page numbers added to ${total} page${total !== 1 ? "s" : ""}!` });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {!file ? (
        <FileDropZone onUpload={f => handleFile(f.file)} accepts=".pdf" emoji="📄" />
      ) : (
        <Panel className="flex flex-col gap-4">

          {/* File info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) border border-(--border-default)">
            <span className="font-emoji">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-(--text-primary) truncate">{file.name}</p>
              <p className="text-xs text-(--text-tertiary)">{formatFileSize(file.size)} · {pageCount} pages</p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} icon={CornerDownLeft}>
              Choose Another
            </Button>
          </div>

          {isLoadingFile ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={40} className="animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">

              {/* ── Controls ── */}
              <div className="flex-2 space-y-4">

                {/* Output filename */}
                <Input
                  label="Output file name"
                  value={outputName}
                  onChange={e => setOutputName(e.target.value)}
                  trailingText=".pdf"
                  placeholder="numbered"
                />

                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  <Select value={vPos} onValueChange={v => setVPos(v as VPos)} label="Vertical position">
                    <SelectTrigger>{toTitleCase(vPos)}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={hPos} onValueChange={v => setHPos(v as HPos)} label="Horizontal position">
                    <SelectTrigger>{toTitleCase(hPos)}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font size + start number */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Font size"
                    type="number"
                    value={fontSize}
                    onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= 144) setFontSize(v); }}
                    min={1} max={144}
                  />
                  <Input
                    label="Start number"
                    type="number"
                    value={startNum}
                    onChange={e => setStartNum(parseInt(e.target.value) || 1)}
                    min={0}
                  />
                </div>

                {/* Template */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <Select value="" onValueChange={v => setTemplate(v)} label="Load a preset">
                      <SelectTrigger>
                        {PRESETS.find(p => p.template === template)?.label || "Choose preset..."}
                      </SelectTrigger>
                      <SelectContent>
                        {PRESETS.map(p => (
                          <SelectItem key={p.template} value={p.template}>
                            <span className="font-mono">{p.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      label="Format template"
                      value={template}
                      onChange={e => setTemplate(e.target.value)}
                      placeholder="{n}"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-(--text-tertiary) mb-1.5">Insert variable</p>
                    <div className="flex flex-wrap gap-1.5">
                      {TEMPLATE_VARS.map(v => (
                        <button
                          key={v.token}
                          title={v.hint}
                          onClick={() => insertToken(v.token)}
                          className="px-2 py-1 rounded border text-xs font-mono bg-(--surface-secondary) text-(--text-primary) border-(--border-default) hover:border-(--border-hover) hover:bg-(--surface-tertiary) transition-colors cursor-pointer"
                        >
                          {v.token}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Style options ── */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-medium text-(--text-secondary) uppercase tracking-wide">Label Style</p>

                  {/* Font family */}
                  <Select value={fontFamily} onValueChange={setFontFamily} label="Font">
                    <SelectTrigger>
                      <span style={{ fontFamily }}>{FONT_OPTIONS.find(f => f.value === fontFamily)?.label ?? "Font"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map(f => (
                        <SelectItem key={f.value} value={f.value}>
                          <span style={{ fontFamily: f.value }}>{f.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Colors row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Font color */}
                    <div className="space-y-1">
                      <p className="text-xs text-(--text-tertiary)">Font color</p>
                      <label className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-(--border-default) bg-(--surface-secondary) cursor-pointer hover:border-(--border-hover) transition-colors">
                        <span
                          className="w-4 h-4 rounded-sm border border-(--border-default) flex-shrink-0"
                          style={{ backgroundColor: fontColor }}
                        />
                        <span className="text-xs font-mono text-(--text-primary)">{fontColor}</span>
                        <input
                          type="color"
                          value={fontColor}
                          onChange={e => setFontColor(e.target.value)}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {/* Background color */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-(--text-tertiary)">Background</p>
                        <button
                          onClick={() => setBgEnabled(v => !v)}
                          className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${bgEnabled
                            ? "bg-primary-500 text-white border-primary-500"
                            : "bg-(--surface-secondary) text-(--text-tertiary) border-(--border-default) hover:border-(--border-hover)"
                            }`}
                        >
                          {bgEnabled ? "on" : "off"}
                        </button>
                      </div>
                      <label className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-(--border-default) bg-(--surface-secondary) transition-colors ${bgEnabled ? "cursor-pointer hover:border-(--border-hover)" : "opacity-40 cursor-not-allowed"}`}>
                        <span
                          className="w-4 h-4 rounded-sm border border-(--border-default) flex-shrink-0"
                          style={{ backgroundColor: bgColor }}
                        />
                        <span className="text-xs font-mono text-(--text-primary)">{bgColor}</span>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={e => setBgColor(e.target.value)}
                          disabled={!bgEnabled}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Radius + Padding row */}
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={borderRadius} onValueChange={setBorderRadius} label="Rounded corners">
                      <SelectTrigger>{RADIUS_OPTIONS.find(r => r.value === borderRadius)?.label ?? "None"}</SelectTrigger>
                      <SelectContent>
                        {RADIUS_OPTIONS.map(r => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={padding} onValueChange={v => setPadding(v as PaddingSize)} label="Padding">
                      <SelectTrigger>{toTitleCase(padding)}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleAddNumbers}
                  disabled={isProcessing || isLoadingFile}
                  icon={isProcessing ? Loader2 : Save}
                  className="w-full"
                >
                  {isProcessing ? "Adding..." : "Add Page Numbers & Download"}
                </Button>

                {status && (
                  <Label
                    icon={status.type === "info" ? Loader2 : status.type === "error" ? X : Check}
                    variant={status.type === "error" ? "danger" : status.type === "success" ? "success" : "default"}
                  >
                    {status.message}
                  </Label>
                )}
              </div>

              {/* ── Document Preview ── */}
              <div className="flex-1 flex flex-col gap-2">
                <Label>Preview</Label>

                {/* Document mockup */}
                <div
                  className="relative rounded-md border border-(--border-default) overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: "var(--surface-overlay)",
                    aspectRatio: "210 / 297", // A4 proportions
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10), 0 1px 3px 0 rgba(0,0,0,0.07)",
                    minHeight: 200,
                  }}
                >
                  {/* Faint ruled lines to suggest a document */}
                  <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full border-b border-(--border-default)"
                        style={{ top: `${10 + i * 6}%`, opacity: 0.35 }}
                      />
                    ))}
                  </div>

                  {/* Top page number */}
                  {vPos === "top" && (
                    <div className="absolute top-0 left-0 right-0 flex px-4 pt-3" style={{ justifyContent: rowJustify }}>
                      <span style={labelStyle}>{previewText}</span>
                    </div>
                  )}

                  {/* Bottom page number */}
                  {vPos === "bottom" && (
                    <div className="absolute bottom-0 left-0 right-0 flex px-4 pb-3" style={{ justifyContent: rowJustify }}>
                      <span style={labelStyle}>{previewText}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-(--text-tertiary)">
                  Live preview — updates as you change settings.
                  {!bgEnabled && borderRadius !== "0px" && (
                    <span className="text-amber-500"> Rounded corners need a background to be visible.</span>
                  )}
                </p>
              </div>

            </div>
          )}
        </Panel>
      )}
    </div>
  );
}