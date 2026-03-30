import { useState, useRef } from "react";
import { Button, ExpectContent, FileInfoBar, InlineFileDrop, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { PDFDocument, StandardFonts, rgb, degrees as pdfDegrees } from "pdf-lib";
import { downloadPdf, formatFileSize } from "@/tools/_pdf-utils";
import FileDropZone from "@/components/advanced/FileDropZone";
import { Box, Container } from "@/components/layout/Primitive";
import { SlidingTabBar, Slider } from "@/components/neoUi"
import { Download, Check, AlertTriangle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

import PdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";
import type { WatermarkMode, WatermarkOpts } from "./types";
import { PdfPageCanvas } from "./PdfPageCanvas";
import { useToast } from "@/hooks/useToast";
import type { ToastType } from "@/stores/toastStore";
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfjsWorker();


export default function WatermarkPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  // Shared
  const [mode, setMode] = useState<WatermarkMode>("text");
  const [opacity, setOpacity] = useState(0.2);
  const [rotation, setRotation] = useState(45);

  // Text mode
  const [watermarkText, setWatermarkText] = useState("DRAFT");
  const [fontSize, setFontSize] = useState(60);

  // Image mode
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);
  const [wmImageSrc, setWmImageSrc] = useState<string>("");
  const [wmImageScale, setWmImageScale] = useState(0.4);
  const wmImageBytesRef = useRef<Uint8Array | null>(null);
  const wmImageTypeRef = useRef<string>("image/png");

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const { toast } = useToast();

  const setStatusAndToast = (msg: string, type: ToastType) => {
    setStatus(msg);
    toast(msg, type);
  }


  const handleFile = async (f: File) => {
    setFile(f);
    setStatus("");
    setPdfDoc(null);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      setPageCount(doc.numPages);
      setPdfDoc(doc);
    } catch {
      setStatusAndToast("Error: Could not read PDF", "error");
    }
  };

  const handleWmImage = async (f: File) => {
    setWmImageFile(f);
    const url = URL.createObjectURL(f);
    setWmImageSrc(url);
    const arr = new Uint8Array(await f.arrayBuffer());
    wmImageBytesRef.current = arr;
    wmImageTypeRef.current = f.type;
  };

  const handleApply = async () => {
    if (!file) return;
    if (mode === "text" && !watermarkText.trim()) return;
    if (mode === "image" && !wmImageBytesRef.current) return;

    setIsProcessing(true);
    setStatus("Applying watermark...");
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPages();

      if (mode === "text") {
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);

        for (const page of pages) {
          const { width, height } = page.getSize();

          const effectiveFontSize = Math.min(fontSize, width * 0.4);

          const textWidth = font.widthOfTextAtSize(watermarkText, effectiveFontSize);
          const textHeight = font.heightAtSize(effectiveFontSize);

          const cx = width / 2;
          const cy = height / 2;
          const rad = (rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const hw = textWidth / 2;
          const hh = textHeight / 2;

          const anchorX = cx - hw * cos + hh * sin;
          const anchorY = cy - hw * sin - hh * cos;

          page.drawText(watermarkText, {
            x: anchorX,
            y: anchorY,
            size: effectiveFontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
            opacity,
            rotate: pdfDegrees(rotation),
          });
        }
      } else {
        // Image watermark
        const bytes = wmImageBytesRef.current!;
        const mimeType = wmImageTypeRef.current;

        let embeddedImage;
        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdf.embedJpg(bytes);
        } else {
          embeddedImage = await pdf.embedPng(bytes);
        }

        for (const page of pages) {
          const { width, height } = page.getSize();

          const imgWidth = width * wmImageScale;
          const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;

          const cx = width / 2;
          const cy = height / 2;
          const rad = (rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const hw = imgWidth / 2;
          const hh = imgHeight / 2;

          const anchorX = cx - hw * cos + hh * sin;
          const anchorY = cy - hw * sin - hh * cos;

          page.drawImage(embeddedImage, {
            x: anchorX,
            y: anchorY,
            width: imgWidth,
            height: imgHeight,
            opacity,
            rotate: pdfDegrees(rotation),
          });
        }
      }

      const bytes = await pdf.save();
      downloadPdf(bytes, `watermarked_${file.name}`);
      setStatusAndToast(`Watermark applied to ${pages.length} page${pages.length !== 1 ? "s" : ""}!`, "success");
    } catch (err) {
      setStatusAndToast(`Error: ${err instanceof Error ? err.message : "Failed"}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setStatus("");
    setPdfDoc(null);
  };

  const watermarkOpts: WatermarkOpts =
    mode === "text"
      ? { mode: "text", text: watermarkText, fontSize, opacity, rotation }
      : { mode: "image", src: wmImageSrc, scale: wmImageScale, opacity, rotation };

  const canApply =
    !isProcessing &&
    !!file &&
    (mode === "text" ? !!watermarkText.trim() : !!wmImageBytesRef.current);

  if (!file) return (
    <Container>
      <FileDropZone onUpload={(f) => handleFile(f.file)} accepts=".pdf" emoji="📄" />
    </Container>
  )

  return (
    <Container cols={2}>

      {/* Control panel */}
      <Box>
        <Panel className="max-h-fit space-y-3">
          <FileInfoBar
            fileName={file.name}
            fileSize={formatFileSize(file.size)}
            text={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
            onReset={reset}
          />

          <SlidingTabBar
            label="Watermark Type"
            tabs={[
              { label: "Text", value: "text" },
              { label: "Image", value: "image" },
            ]}
            onValueChange={(v) => setMode(v as "text" | "image")}
          />

          {/* Text mode controls */}
          {mode === "text" && (
            <>
              <Input
                label="Watermark Text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                handlePaste={setWatermarkText}
                placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
              />
              <Input
                label="Font Size"
                type="number"
                value={fontSize}
                onChange={(e) =>
                  setFontSize(Math.max(8, parseInt(e.target.value) || 60))
                }
                trailingText="pt"
                min={8}
                max={300}
              />

            </>
          )}

          {/* Image mode controls */}
          {mode === "image" && (
            <>
              <div className="w-full">
                <InlineFileDrop
                  label="Watermark Image"
                  text={wmImageFile ? wmImageFile.name : "Upload Image"}
                  variant="full"
                  onUpload={f => handleWmImage(f.file)}
                  accept=".png,.jpg,.jpeg,.webp" />
              </div>
              <Slider
                label="Size"
                min={5}
                max={100}
                step={1}
                value={Math.round(wmImageScale * 100)}
                afterValue="%"
                onChange={(e) => setWmImageScale(Number(e.target.value) / 100)}
                className="w-full"
              />

            </>
          )}

          {/* Shared controls */}

          <Slider
            label="Opacity"
            min={1}
            max={100}
            step={1}
            value={Math.round(opacity * 100)}
            afterValue="%"
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="w-full"
          />

          <Slider
            label="Rotation"
            min={0}
            max={360}
            step={1}
            value={Math.round(rotation)}
            afterValue="°"
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full"
          />
          <Button
            icon={Download}
            onClick={handleApply}
            disabled={!canApply}
            className="w-full"
          >
            {isProcessing ? "Applying..." : "Apply Watermark & Download"}
          </Button>
          {status && (
            <Label
              icon={status.startsWith("Error") ? AlertTriangle : Check}
              variant={status.startsWith("Error") ? "danger" : "success"}
            >
              {status}
            </Label>
          )}
        </Panel>
      </Box>

      {/* Preview panel */}
      <Box>
        <Panel>
          {pdfDoc ? (
            <>
              <Label>Preview</Label>
              <div className="flex justify-center">
                <PdfPageCanvas
                  pdfDoc={pdfDoc}
                  pageNum={1}
                  watermark={watermarkOpts}
                />
              </div>
            </>
          ) : <ExpectContent text="PDF preview should appear here" emoji="🩰" />}
        </Panel>
      </Box>

    </Container>
  );
}