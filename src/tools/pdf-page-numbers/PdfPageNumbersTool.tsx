import { useState, useEffect, useRef } from "react";
import { Button, Input, Label, ColorInput, FileInfoBar, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, Loader2, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toTitleCase } from "@/lib";
import * as pdfjsLib from "pdfjs-dist";

// ── Types ────────────────────────────────────────────────────────────────────
type VPos = "top" | "bottom";
type HPos = "left" | "center" | "right";
type Status = { type: "error" | "success" | "info"; message: string } | null;

// ── Number formatters ────────────────────────────────────────────────────────
function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let r = "";
  vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v; } });
  return r || "0";
}

function toOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function toWord(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "minus " + toWord(-n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + toWord(n % 100) : "");
  return n.toString();
}

// ── Template engine ──────────────────────────────────────────────────────────
function resolveTemplate(tpl: string, page: number, total: number): string {
  return tpl
    .replace(/\{n\}/g, String(page))
    .replace(/\{total\}/g, String(total))
    .replace(/\{roman\}/g, toRoman(page).toLowerCase())
    .replace(/\{ROMAN\}/g, toRoman(page))
    .replace(/\{word\}/g, toWord(page))
    .replace(/\{ord\}/g, toOrdinal(page));
}

// ── Constants ────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "1", template: "{n}" },
  { label: "[1]", template: "[{n}]" },
  { label: "— 1 —", template: "— {n} —" },
  { label: "· 1 ·", template: "· {n} ·" },
  { label: "-1-", template: "-{n}-" },
  { label: "i  (roman lower)", template: "{roman}" },
  { label: "I  (roman upper)", template: "{ROMAN}" },
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
  { token: "{roman}", hint: "Lowercase roman (e.g. iv)" },
  { token: "{ROMAN}", hint: "Uppercase roman (e.g. IV)" },
  { token: "{word}", hint: "Number as words (e.g. four)" },
  { token: "{ord}", hint: "Ordinal suffix (e.g. 4th)" },
];

const FONT_OPTIONS = [
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif", pdfKey: "Helvetica" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif", pdfKey: "TimesRoman" },
  { label: "Courier New", value: "'Courier New', Courier, monospace", pdfKey: "Courier" },
];

const PDF_FONT_MAP: Record<string, StandardFonts> = {
  Helvetica: StandardFonts.Helvetica,
  TimesRoman: StandardFonts.TimesRoman,
  Courier: StandardFonts.Courier,
};

const MARGIN = 36;

function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function countNumberedPages(pageCount: number, startAtPage: number, skipFirstPage: boolean): number {
  let count = 0;
  for (let i = 0; i < pageCount; i++) {
    const pageNum1 = i + 1;
    if (pageNum1 < startAtPage) continue;
    if (skipFirstPage && pageNum1 === 1) continue;
    count++;
  }
  return count;
}

// ── Preview renderer ─────────────────────────────────────────────────────────
// Renders one PDF page into a canvas using pdfjs, then overlays the number.
async function renderPreview(
  pdfBytes: ArrayBuffer,
  pageIndex: number, // 0-based
  canvas: HTMLCanvasElement,
  opts: {
    vPos: VPos;
    hPos: HPos;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    text: string;
    alternatingMargin: boolean;
    isEvenPage: boolean; // whether this page index is even (0-based)
  }
) {
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageIndex + 1); // pdfjs is 1-based

  const viewport = page.getViewport({ scale: 1.5 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx as CanvasRenderingContext2D, canvas, viewport }).promise;

  // Draw overlay text
  const scale = viewport.scale;
  const scaledMargin = MARGIN * scale;
  const scaledFontSize = opts.fontSize * scale;

  ctx.font = `${scaledFontSize}px ${opts.fontFamily}`;
  ctx.fillStyle = opts.fontColor;

  const textWidth = ctx.measureText(opts.text).width;
  const pw = canvas.width;
  const ph = canvas.height;

  // Alternating margin: on even pages (left-hand), inner margin is right; on odd, inner is left
  let x: number;
  if (opts.alternatingMargin) {
    // isEvenPage (0-based): page 0 = right side inner, page 1 = left side inner
    const isInnerLeft = opts.isEvenPage; // even page index → inner is on the left
    x = isInnerLeft ? scaledMargin : pw - scaledMargin - textWidth;
  } else {
    x = opts.hPos === "left"
      ? scaledMargin
      : opts.hPos === "right"
        ? pw - scaledMargin - textWidth
        : (pw - textWidth) / 2;
  }

  const y = opts.vPos === "bottom"
    ? ph - scaledMargin
    : scaledMargin + scaledFontSize;

  ctx.fillText(opts.text, x, y);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [vPos, setVPos] = useState<VPos>("bottom");
  const [hPos, setHPos] = useState<HPos>("center");
  const [fontSize, setFontSize] = useState(12);
  const [startNum, setStartNum] = useState(1);
  const [startAtPage, setStartAtPage] = useState(1); // 1-based: which PDF page to begin numbering on
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [alternatingMargin, setAlternatingMargin] = useState(false);
  const [template, setTemplate] = useState("{n}");
  const [outputName, setOutputName] = useState("");
  const [fontColor, setFontColor] = useState("#4d4d4d");
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use a ref to track the latest preview request so stale renders don't win
  const previewGenRef = useRef(0);

  // The page index (0-based) to preview: first page where numbers actually appear
  const effectiveStartPage = skipFirstPage ? Math.max(startAtPage, 2) : startAtPage; // 1-based
  const previewPageIndex = Math.min(effectiveStartPage - 1, pageCount - 1); // 0-based, clamped


  // The number displayed on that preview page
  const previewPageNumber = startNum; // first number always starts at startNum on effectiveStartPage

  const numberedPageCount = countNumberedPages(pageCount, startAtPage, skipFirstPage);
  const totalNumbered = startNum + numberedPageCount - 1;

  const previewText = resolveTemplate(template || "{n}", previewPageNumber, totalNumbered);

  // Trigger preview whenever any relevant option changes or file loads
  useEffect(() => {
    if (!pdfBytes || !canvasRef.current || pageCount === 0) return;

    const gen = ++previewGenRef.current;
    setIsRenderingPreview(true);

    // Clone bytes for this render (pdfjs consumes the buffer)
    const bytesCopy = pdfBytes.slice(0);

    renderPreview(bytesCopy, previewPageIndex, canvasRef.current, {
      vPos,
      hPos,
      fontSize,
      fontColor,
      fontFamily,
      text: previewText,
      alternatingMargin,
      isEvenPage: previewPageIndex % 2 === 0,
    }).then(() => {
      if (gen === previewGenRef.current) setIsRenderingPreview(false);
    }).catch(() => {
      if (gen === previewGenRef.current) setIsRenderingPreview(false);
    });
  }, [pdfBytes, previewPageIndex, vPos, hPos, fontSize, fontColor, fontFamily, previewText, alternatingMargin, pageCount]);

  const handleFile = async (incoming: File) => {
    setIsLoading(true);
    setFile(incoming);
    setStatus(null);
    setStartAtPage(1);
    setSkipFirstPage(false);
    setOutputName(incoming.name.replace(/\.pdf$/i, "") + "-numbered");
    try {
      const bytes = await incoming.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      // Store a fresh copy of the bytes for preview rendering
      setPdfBytes(bytes.slice(0));
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Could not read PDF." });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setStatus(null);
    setOutputName("");
    previewGenRef.current = 0;
  };

  const handleSave = async () => {
    if (!file || !template || !pdfBytes) return;
    setIsProcessing(true);
    setStatus({ type: "info", message: "Adding page numbers…" });
    try {
      const pdf = await PDFDocument.load(pdfBytes.slice(0), { ignoreEncryption: true });
      const pdfKey = FONT_OPTIONS.find(f => f.value === fontFamily)?.pdfKey ?? "Helvetica";
      const font = await pdf.embedFont(PDF_FONT_MAP[pdfKey]);
      const pages = pdf.getPages();
      const total = startNum + countNumberedPages(pages.length, startAtPage, skipFirstPage) - 1;
      const [fr, fg, fb] = hexToRgb01(fontColor);

      let numberIndex = 0; // tracks which sequential number to draw

      pages.forEach((page, i) => {
        const pageNum1 = i + 1; // 1-based page number

        // Skip if before startAtPage
        if (pageNum1 < startAtPage) return;
        // Skip first page of the document if toggle is on
        if (skipFirstPage && pageNum1 === 1) return;

        const { width, height } = page.getSize();
        const text = resolveTemplate(template, startNum + numberIndex, total);
        numberIndex++;

        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x: number;
        if (alternatingMargin) {
          // i is 0-based. Even index = right-hand page (inner margin on left for book binding)
          const innerIsLeft = i % 2 === 1; // page index 1,3,5… = left-hand pages, inner margin on right
          x = innerIsLeft ? width - MARGIN - textWidth : MARGIN;
        } else {
          x = hPos === "left" ? MARGIN
            : hPos === "right" ? width - MARGIN - textWidth
              : (width - textWidth) / 2;
        }

        const y = vPos === "bottom" ? MARGIN : height - MARGIN - fontSize;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(fr, fg, fb) });
      });

      downloadPdf(await pdf.save(), (outputName.trim() || "numbered") + ".pdf");
      setStatus({ type: "success", message: `Page numbers added successfully!` });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return <FileDropZone onUpload={f => handleFile(f.file)} accepts=".pdf" emoji="📄" />;
  }

  return (
    <Panel className="flex flex-col gap-3">

      {/* File info bar */}
      <FileInfoBar
        emoji="📄"
        fileName={file.name}
        fileSize={formatFileSize(file.size)}
        text={`${pageCount} pages`}
        onReset={reset}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-6">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <Label>Loading document...</Label>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-2">

          {/* ── Controls ── */}
          <div className="flex-2 space-y-3">

            {/* Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Select value={vPos} onValueChange={v => setVPos(v as VPos)} label="Vertical position">
                <SelectTrigger>{toTitleCase(vPos)}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hPos} onValueChange={v => setHPos(v as HPos)} label="Horizontal position">
                <SelectTrigger>{alternatingMargin ? "Alternating" : toTitleCase(hPos)}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font size + start number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                label="Font size" type="number" min={1} max={144}
                value={fontSize}
                onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= 144) setFontSize(v); }}
              />
              <Input
                label="Start numbering at" type="number" min={1}
                value={startNum}
                onChange={e => setStartNum(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Start-at-page + skip first page */}
            <div className="grid grid-cols-1 gap-2 items-center">
              <Input
                label={`Begin on page (1-${pageCount})`}
                type="number"
                min={1}
                max={pageCount}
                value={startAtPage}
                onChange={e => {
                  const v = Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1));
                  setStartAtPage(v);
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Toggle
                  checked={skipFirstPage}
                  label="Skip first page"
                  onChange={setSkipFirstPage}
                />
                <Toggle
                  checked={alternatingMargin}
                  label="Alternating margin"
                  onChange={setAlternatingMargin}
                />
              </div>
            </div>

            {/* Template */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
                <Select value="" onValueChange={setTemplate} label="Load a preset">
                  <SelectTrigger>
                    {PRESETS.find(p => p.template === template)?.label || "Choose preset…"}
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
                <Label>Insert variable</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {TEMPLATE_VARS.map(v => (
                    <Button
                      key={v.token} title={v.hint}
                      onClick={() => setTemplate(prev => prev + v.token)}
                      size="xs" variant="secondary" className="font-mono"
                    >
                      {v.token}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Select value={fontFamily} onValueChange={setFontFamily} label="Font">
                <SelectTrigger>
                  <span style={{ fontFamily }}>
                    {FONT_OPTIONS.find(f => f.value === fontFamily)?.label ?? "Font"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ColorInput label="Font color" value={fontColor} debounce onChange={e => setFontColor(e.target.value)} />
            </div>

            {/* Output name + Save */}
            <div className="space-y-2 pt-1">
              <Input
                label="File name"
                value={outputName}
                onChange={e => setOutputName(e.target.value)}
                trailingText=".pdf"
                placeholder="numbered"
              />
              <Button
                onClick={handleSave}
                disabled={isProcessing || !template}
                icon={isProcessing ? Loader2 : Save}
                className="w-full"
              >
                {isProcessing ? "Adding…" : "Add Page Numbers & Download"}
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
          </div>

          {/* ── Preview ── */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <Label>
              Preview — page {previewPageIndex + 1}
              {isRenderingPreview && (
                <Loader2 size={12} className="animate-spin inline ml-2 opacity-50" />
              )}
            </Label>
            <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {isRenderingPreview && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[1px]">
                  <Loader2 size={28} className="animate-spin text-primary-500" />
                </div>
              )}
            </div>
            {alternatingMargin && (
              <p className="text-xs text-neutral-500 leading-snug">
                Alternating margin: odd pages number on the right, even pages on the left (book-style binding).
              </p>
            )}
          </div>

        </div>
      )}
    </Panel>
  );
}