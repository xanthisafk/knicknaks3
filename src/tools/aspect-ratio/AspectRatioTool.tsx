import { useState, useCallback } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function parseRatio(str: string): [number, number] | null {
  const parts = str.split(":").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && parts.every((n) => !isNaN(n) && n > 0)) {
    return [parts[0], parts[1]];
  }
  return null;
}

const PRESETS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "3:2", w: 3, h: 2 },
  { label: "21:9", w: 21, h: 9 },
  { label: "9:16", w: 9, h: 16 },
];

type Mode = "detect" | "scale";

export default function AspectRatioTool() {
  const [mode, setMode] = useState<Mode>("detect");

  // Detect mode
  const [detectW, setDetectW] = useState("");
  const [detectH, setDetectH] = useState("");

  // Scale mode
  const [ratioStr, setRatioStr] = useState("16:9");
  const [scaleW, setScaleW] = useState("");
  const [scaleH, setScaleH] = useState("");

  // --- Detect mode logic ---
  const dw = parseFloat(detectW);
  const dh = parseFloat(detectH);
  const canDetect = !isNaN(dw) && !isNaN(dh) && dw > 0 && dh > 0;

  let detectedRatio = "";
  let decimalRatio = "";
  if (canDetect) {
    const d = gcd(Math.round(dw), Math.round(dh));
    detectedRatio = `${Math.round(dw) / d}:${Math.round(dh) / d}`;
    decimalRatio = (dw / dh).toFixed(4);
  }

  // --- Scale mode logic ---
  const ratio = parseRatio(ratioStr);
  const sw = parseFloat(scaleW);
  const sh = parseFloat(scaleH);

  let scaledW = "";
  let scaledH = "";
  let scaleError = "";

  if (ratio) {
    const [rw, rh] = ratio;
    if (!isNaN(sw) && sw > 0 && (isNaN(sh) || scaleH === "")) {
      scaledH = ((sw / rw) * rh).toFixed(0);
    } else if (!isNaN(sh) && sh > 0 && (isNaN(sw) || scaleW === "")) {
      scaledW = ((sh / rh) * rw).toFixed(0);
    }
  } else if (ratioStr.trim() !== "") {
    scaleError = "Enter a valid ratio like 16:9";
  }

  const applyPreset = useCallback((w: number, h: number) => {
    const d = gcd(w, h);
    setRatioStr(`${w / d}:${h / d}`);
    setScaleW("");
    setScaleH("");
  }, []);

  const handleDetectPreset = useCallback((w: number, h: number) => {
    setDetectW(String(w * 100));
    setDetectH(String(h * 100));
  }, []);

  const clearDetect = () => { setDetectW(""); setDetectH(""); };
  const clearScale = () => { setScaleW(""); setScaleH(""); };

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <Panel>
        <div className="flex gap-2">
          {(["detect", "scale"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-colors cursor-pointer ${
                mode === m
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]"
              }`}
            >
              {m === "detect" ? "Detect Ratio" : "Scale Dimensions"}
            </button>
          ))}
        </div>
      </Panel>

      {mode === "detect" && (
        <>
          <Panel>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Width (px)"
                  type="number"
                  value={detectW}
                  onChange={(e) => setDetectW(e.target.value)}
                  placeholder="e.g. 1920"
                  min={1}
                />
                <Input
                  label="Height (px)"
                  type="number"
                  value={detectH}
                  onChange={(e) => setDetectH(e.target.value)}
                  placeholder="e.g. 1080"
                  min={1}
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">Quick presets</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleDetectPreset(p.w, p.h)}
                      className="px-3 py-1 rounded-[var(--radius-sm)] text-xs font-mono bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          {canDetect && (
            <Panel>
              <div className="space-y-3">
                <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Result</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-4 py-3 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Aspect Ratio</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{detectedRatio}</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-4 py-3 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Decimal</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{decimalRatio}</p>
                  </div>
                </div>

                {/* Visual preview */}
                <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex items-center justify-center">
                  <div
                    className="bg-[var(--color-primary)] rounded-[var(--radius-sm)] opacity-80 flex items-center justify-center"
                    style={{
                      width: `${Math.min(240, (dw / dh) * 120)}px`,
                      height: `${Math.min(120, (dh / dw) * 240)}px`,
                    }}
                  >
                    <span className="text-white text-xs font-mono font-medium">
                      {detectedRatio}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="ghost" onClick={clearDetect}>Clear</Button>
              </div>
            </Panel>
          )}
        </>
      )}

      {mode === "scale" && (
        <>
          <Panel>
            <div className="space-y-4">
              <Input
                label="Aspect Ratio"
                value={ratioStr}
                onChange={(e) => { setRatioStr(e.target.value); clearScale(); }}
                placeholder="e.g. 16:9"
                helperText={scaleError || "Enter as W:H, e.g. 16:9 or 4:3"}
              />

              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className={`px-3 py-1 rounded-[var(--radius-sm)] text-xs font-mono border transition-colors cursor-pointer ${
                      ratioStr === `${p.w / gcd(p.w, p.h)}:${p.h / gcd(p.w, p.h)}`
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-[var(--surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Width (px)"
                  type="number"
                  value={scaleW || (scaledW && scaleH ? scaledW : scaleW)}
                  onChange={(e) => { setScaleW(e.target.value); setScaleH(""); }}
                  placeholder="Enter width…"
                  min={1}
                />
                <Input
                  label="Height (px)"
                  type="number"
                  value={scaleH || (scaledH && scaleW ? scaledH : scaleH)}
                  onChange={(e) => { setScaleH(e.target.value); setScaleW(""); }}
                  placeholder="Enter height…"
                  min={1}
                />
              </div>
            </div>
          </Panel>

          {ratio && (scaleW || scaleH) && (scaledW || scaledH) && (
            <Panel>
              <div className="space-y-3">
                <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Calculated</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-4 py-3 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Width</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                      {scaleW || scaledW}
                      <span className="text-sm font-normal text-[var(--text-tertiary)] ml-1">px</span>
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] px-4 py-3 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Height</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                      {scaleH || scaledH}
                      <span className="text-sm font-normal text-[var(--text-tertiary)] ml-1">px</span>
                    </p>
                  </div>
                </div>

                {/* Visual preview */}
                {(() => {
                  const w = parseFloat(scaleW || scaledW);
                  const h = parseFloat(scaleH || scaledH);
                  if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                    return (
                      <div className="rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex items-center justify-center">
                        <div
                          className="bg-[var(--color-primary)] rounded-[var(--radius-sm)] opacity-80 flex items-center justify-center"
                          style={{
                            width: `${Math.min(240, (w / h) * 120)}px`,
                            height: `${Math.min(120, (h / w) * 240)}px`,
                          }}
                        >
                          <span className="text-white text-xs font-mono font-medium">
                            {ratioStr}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="mt-3">
                <Button variant="ghost" onClick={clearScale}>Clear</Button>
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}