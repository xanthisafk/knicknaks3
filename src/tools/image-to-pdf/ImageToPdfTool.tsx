import { useState, useCallback } from "react";
import { Button, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import type { PDFPage, PDFImage } from "pdf-lib";
import { Check, ChevronLeft, ChevronRight, CornerDownLeft, Loader2, RefreshCcw, RotateCcw, RotateCw, X } from "lucide-react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import FileDropZone from "@/components/advanced/FileDropZone";
import { cn } from "@/lib";

// ─── Page size presets (in points: 1pt = 1/72 inch) ───────────────────────────
const PAGE_PRESETS = {
  "fit-image": { label: "Fit to Image", width: null, height: null },
  "a4-portrait": { label: "A4 Portrait", width: 595, height: 842 },
  "a4-landscape": { label: "A4 Landscape", width: 842, height: 595 },
  "letter-portrait": { label: "Letter Portrait", width: 612, height: 792 },
  "letter-landscape": { label: "Letter Landscape", width: 792, height: 612 },
  "square-sm": { label: "Square 4x4″", width: 288, height: 288 },
  "square-lg": { label: "Square 8x8″", width: 576, height: 576 },
} as const;

type PresetKey = keyof typeof PAGE_PRESETS;

type FitMode = "contain" | "cover" | "stretch";

interface ImageItem {
  file: File;
  preview: string;
  rotation: 0 | 90 | 180 | 270;
}

// ─── Image card with rotation preview ─────────────────────────────────────────
function ImageCard({
  item,
  index,
  total,
  onRemove,
  onMove,
  onRotate,
}: {
  item: ImageItem;
  index: number;
  total: number;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
  onRotate: () => void;
}) {
  const rotateClass = `-rotate-${item.rotation}`;

  return (
    <div className="relative flex flex-col gap-1.5 p-2 rounded-md border border-(--border-default) bg-(--surface-secondary)">
      {/* Preview */}
      <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-sm bg-(--surface-primary)">
        <img
          src={item.preview}
          alt={item.file.name}
          className={cn(
            "max-w-full max-h-full object-contain transition-transform duration-300",
            rotateClass
          )}
        />
      </div>

      <p className="text-xs text-(--text-secondary) truncate">{item.file.name}</p>
      <p className="text-xs text-(--text-tertiary)">{formatFileSize(item.file.size)}</p>
      <p className="text-xs text-(--text-tertiary)">{item.rotation}°</p>

      <div className="flex justify-between gap-1">
        {/* Reorder */}
        <div className="flex items-center gap-1">
          <Button
            onClick={() => onMove("up")}
            disabled={index === 0}
            title="Move left"
            variant="ghost"
            size="xs"
            icon={ChevronLeft}
          />
          <Button
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            title="Move right"
            variant="ghost"
            size="xs"
            icon={ChevronRight}
          />

          {/* Rotate */}
          <Button
            onClick={onRotate}
            title="Rotate 90° clockwise"
            variant="ghost"
            size="xs"
            icon={RotateCw}
          />
        </div>

        {/* Remove */}
        <Button
          onClick={onRemove}
          variant="ghost"
          size="xs"
          icon={X}
        />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ImageToPdfTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [filename, setFilename] = useState("");

  // Layout options
  const [preset, setPreset] = useState<PresetKey>("fit-image");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState(20); // points

  const isFitImage = preset === "fit-image";

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFiles = useCallback((e: { files: File[] }) => {
    const newFiles = Array.from(e.files ?? []);
    if (newFiles.length === 0) return;
    setStatus("");

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setItems((prev) => [
          ...prev,
          { file, preview: reader.result as string, rotation: 0 },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const moveItem = (from: number, dir: "up" | "down") => {
    const to = dir === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= items.length) return;
    setItems((prev) => {
      const n = [...prev];
      [n[from], n[to]] = [n[to], n[from]];
      return n;
    });
  };

  const rotateItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, rotation: ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : item
      )
    );
  };

  // ── Embed image helper ───────────────────────────────────────────────────────
  async function embedImage(pdf: PDFDocument, file: File) {
    const bytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(bytes);

    if (file.type === "image/png") return pdf.embedPng(uint8);
    if (file.type === "image/jpeg" || file.type === "image/jpg")
      return pdf.embedJpg(uint8);

    // Convert other formats via canvas
    const bitmap = await createImageBitmap(new Blob([bytes], { type: file.type }));
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
    const pngBlob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), "image/png")
    );
    return pdf.embedPng(new Uint8Array(await pngBlob.arrayBuffer()));
  }

  // ── Convert ──────────────────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setStatus("Converting...");

    try {
      const pdf = await PDFDocument.create();
      const presetCfg = PAGE_PRESETS[preset];

      for (const { file, rotation } of items) {
        const image = await embedImage(pdf, file);

        // Dimensions after rotation
        const isRotated90or270 = rotation === 90 || rotation === 270;
        const imgW = isRotated90or270 ? image.height : image.width;
        const imgH = isRotated90or270 ? image.width : image.height;

        // Determine page dimensions
        const pageW = presetCfg.width ?? imgW;
        const pageH = presetCfg.height ?? imgH;

        const page = pdf.addPage([pageW, pageH]);

        if (isFitImage) {
          // Original behaviour — image IS the page
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
            rotate: degrees(rotation),
            // pdf-lib rotates around origin so we compensate
            xSkew: degrees(0),
            ySkew: degrees(0),
          });
          // Easier: just resize page to the rotated image dims
          // Re-draw without rotation by rotating page instead
          // We'll use the simpler approach: draw with pdf-lib rotation
          // (pdf-lib rotate draws around bottom-left; adjust origin)
          // Actually let's clear and redraw properly:
          page.setSize(pageW, pageH);
          drawRotatedImage(page, image, pageW, pageH, rotation);
        } else {
          // Fit onto the preset page with optional margin
          const usableW = pageW - margin * 2;
          const usableH = pageH - margin * 2;

          let drawW: number, drawH: number, drawX: number, drawY: number;

          if (fitMode === "stretch") {
            drawW = usableW;
            drawH = usableH;
          } else {
            const scaleX = usableW / imgW;
            const scaleY = usableH / imgH;
            const scale =
              fitMode === "contain" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
            drawW = imgW * scale;
            drawH = imgH * scale;
          }

          // Centre on page
          drawX = margin + (usableW - drawW) / 2;
          drawY = margin + (usableH - drawH) / 2;

          drawRotatedImageScaled(page, image, drawX, drawY, drawW, drawH, rotation, pageW, pageH);
        }
      }

      const pdfBytes = await pdf.save();
      const file = filename ? filename + ".pdf" : "images.pdf";
      downloadPdf(pdfBytes, file);
      setStatus(`Created PDF with ${items.length} page${items.length > 1 ? "s" : ""}!`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* ── Drop zone ── */}
      <FileDropZone
        accepts="image/png,image/jpeg,image/webp,image/bmp"
        multiple={true}
        onUpload={handleFiles}
        emoji="🖼️" />
      {items.length > 0 && <Panel>
        {/* ── Image grid with preview + rotation ── */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <ImageCard
              key={`img-${i}-${item.file.name}`}
              item={item}
              index={i}
              total={items.length}
              onRemove={() => removeItem(i)}
              onMove={(dir) => moveItem(i, dir)}
              onRotate={() => rotateItem(i)}
            />
          ))}
        </div>

      </Panel>}

      {/* ── Layout options ── */}
      {items.length > 0 && <Panel>
        <div className="space-y-4">
          <div>
            <Label>
              Page Size
            </Label>
            <div className="flex flex-wrap gap-1.5">
              <RadioGroup value={preset} onValueChange={v => setPreset(v as PresetKey)}>
                {(Object.keys(PAGE_PRESETS) as PresetKey[]).map((key) => (
                  <Radio
                    key={key}
                    value={key}
                    label={PAGE_PRESETS[key].label}
                  />
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Fit mode + margin — only when a fixed page size is selected */}
          {!isFitImage && (
            <div className="flex gap-2">
              <div className="w-full flex flex-col">
                <Label>Image Fit</Label>
                <Tabs value={fitMode} onValueChange={v => setFitMode(v as FitMode)}>
                  <TabList>
                    <Tab value="contain">Contain</Tab>
                    <Tab value="cover">Cover</Tab>
                    <Tab value="stretch">Stretch</Tab>
                  </TabList>
                </Tabs>
              </div>

              <div className="w-full flex flex-col">
                <Input
                  type="number"
                  label="Margin"
                  min={0}
                  max={72}
                  value={margin}
                  onChange={e => {
                    let v = Number(e.target.value);
                    if (v < 0 || v > 72) v = 20;
                    setMargin(v);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Panel>}

      {/* ── Actions ── */}
      {items.length > 0 && <Panel className="space-y-2">
        <Input
          label="Filename"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          placeholder={"images"}
          trailingText=".pdf"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={handleConvert}
            icon={RefreshCcw}
            disabled={items.length === 0 || isProcessing}
          >
            {isProcessing
              ? "Converting..."
              : `Convert ${items.length} Image${items.length !== 1 ? "s" : ""} to PDF`}
          </Button>
          {items.length > 0 && (
            <Button
              variant="ghost"
              icon={CornerDownLeft}
              onClick={() => {
                setItems([]);
                setStatus("");
              }}
            >
              Clear All
            </Button>
          )}
        </div>
        {status && (
          <p
            className={`mt-3 text-sm ${status.startsWith("Error")
              ? "text-(--color-error)"
              : "text-(--text-secondary)"
              }`}
          >
            {status.startsWith("Converting") && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>{status}</span>
              </div>
            )}
            {status.startsWith("Error") && (
              <div className="flex items-center gap-2">
                <X className="text-red-500" />
                <span>{status}</span>
              </div>
            )}
            {status.startsWith("Created") && (
              <div className="flex items-center gap-2">
                <Check className="text-green-500" />
                <span>{status}</span>
              </div>
            )}
          </p>
        )}
      </Panel>}
    </div>
  );
}

// ─── Drawing helpers ───────────────────────────────────────────────────────────
// pdf-lib coordinate system: origin at bottom-left, Y goes up.
// rotation is clockwise in screen space = counter-clockwise in PDF space.

function drawRotatedImage(
  page: PDFPage,
  image: PDFImage,
  pageW: number,
  pageH: number,
  rotation: 0 | 90 | 180 | 270
) {
  const w = image.width;
  const h = image.height;

  // For "fit to image" mode the page was already sized to (imgW, imgH) after
  // accounting for rotation. We just draw the raw image filling the page.
  switch (rotation) {
    case 0:
      page.drawImage(image, { x: 0, y: 0, width: w, height: h });
      break;
    case 90:
      // Page is (h x w). Image rotated 90° CW: origin shifts to (h, 0).
      page.drawImage(image, {
        x: pageW,
        y: 0,
        width: w,
        height: h,
        rotate: degrees(90),
      });
      break;
    case 180:
      page.drawImage(image, {
        x: pageW,
        y: pageH,
        width: w,
        height: h,
        rotate: degrees(180),
      });
      break;
    case 270:
      page.drawImage(image, {
        x: 0,
        y: pageH,
        width: w,
        height: h,
        rotate: degrees(270),
      });
      break;
  }
}

function drawRotatedImageScaled(
  page: PDFPage,
  image: PDFImage,
  drawX: number,
  drawY: number,
  drawW: number,
  drawH: number,
  rotation: 0 | 90 | 180 | 270,
  _pageW: number,
  _pageH: number
) {
  // drawX/Y/W/H describe the bounding box of the image in page coords (already
  // centred). For rotated images the "visual" width/height are swapped vs the
  // raw image dims, so we pass them in raw-image order to pdf-lib and compensate
  // the origin.
  const isSwapped = rotation === 90 || rotation === 270;
  const rawW = isSwapped ? drawH : drawW;
  const rawH = isSwapped ? drawW : drawH;

  switch (rotation) {
    case 0:
      page.drawImage(image, { x: drawX, y: drawY, width: rawW, height: rawH });
      break;
    case 90:
      page.drawImage(image, {
        x: drawX + drawW,
        y: drawY,
        width: rawW,
        height: rawH,
        rotate: degrees(90),
      });
      break;
    case 180:
      page.drawImage(image, {
        x: drawX + drawW,
        y: drawY + drawH,
        width: rawW,
        height: rawH,
        rotate: degrees(180),
      });
      break;
    case 270:
      page.drawImage(image, {
        x: drawX,
        y: drawY + drawH,
        width: rawW,
        height: rawH,
        rotate: degrees(270),
      });
      break;
  }
}