import { useState } from "react";
import { Button, Input, Label, ColorInput, FileInfoBar } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Check, Loader2, Save, TriangleAlert, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toTitleCase } from "@/lib";


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
  const [fontColor, setFontColor] = useState("#4d4d4d");
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleFile = async (incoming: File) => {
    setIsLoading(true);
    setFile(incoming);
    setStatus(null);
    setOutputName(incoming.name.replace(/\.pdf$/i, "") + "-numbered");
    try {
      const pdf = await PDFDocument.load(await incoming.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Could not read PDF." });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => { setFile(null); setPageCount(0); setStatus(null); setOutputName(""); };

  const handleSave = async () => {
    if (!file || !template) return;
    setIsProcessing(true);
    setStatus({ type: "info", message: "Adding page numbers…" });
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const pdfKey = FONT_OPTIONS.find(f => f.value === fontFamily)?.pdfKey ?? "Helvetica";
      const font = await pdf.embedFont(PDF_FONT_MAP[pdfKey]);
      const pages = pdf.getPages();
      const total = pages.length;
      const [fr, fg, fb] = hexToRgb01(fontColor);

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = resolveTemplate(template, startNum + i, startNum + total - 1);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x =
          hPos === "left" ? MARGIN :
            hPos === "right" ? width - MARGIN - textWidth :
              (width - textWidth) / 2;
        const y = vPos === "bottom" ? MARGIN : height - MARGIN - fontSize;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(fr, fg, fb) });
      });

      downloadPdf(await pdf.save(), (outputName.trim() || "numbered") + ".pdf");
      setStatus({ type: "success", message: `Page numbers added to ${total} page${total !== 1 ? "s" : ""}!` });
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
        <div className="flex items-center justify-center py-10">
          <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">

          {/* ── Controls ── */}
          <div className="flex-2 space-y-4">

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
                <SelectTrigger>{toTitleCase(hPos)}</SelectTrigger>
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
                label="Start number" type="number" min={0}
                value={startNum}
                onChange={e => setStartNum(parseInt(e.target.value) || 1)}
              />
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

            {/* Output name + Save — grouped at the bottom */}
            <div className="space-y-2 pt-1">
              <Input
                label="Output file name"
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

        </div>
      )}
    </Panel>
  );
}