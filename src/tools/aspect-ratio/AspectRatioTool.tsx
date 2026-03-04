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
    <div className="space-y-6">
      {/* Mode tabs */}
      <Panel>
        <div className="flex p-1 bg-[var(--surface-secondary)] rounded-[var(--radius-lg)] border border-[var(--border-default)]">
          {(["detect", "scale"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === m
                  ? "bg-white dark:bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent"
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
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">Quick presets</h3>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleDetectPreset(p.w, p.h)}
                      className="px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-mono bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-400)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
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
               <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Result</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-transparent dark:from-[var(--color-primary-900)] opacity-20 transition-opacity group-hover:opacity-40"></div>
                    <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1 relative z-10">Aspect Ratio</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight relative z-10">{detectedRatio}</p>
                  </div>
                  <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center">
                    <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1">Decimal</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight">{decimalRatio}</p>
                  </div>
                </div>

                {/* Visual preview */}
                <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-6 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                   <div className="absolute inset-0 bg-[var(--border-default)] opacity-10" style={{ backgroundImage: "radial-gradient(var(--border-primary) 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
                  <div
                    className="bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] rounded-[var(--radius-md)] shadow-md flex items-center justify-center transition-all duration-300 ease-out relative z-10 ring-4 ring-[var(--surface-primary)] dark:ring-[var(--surface-secondary)]"
                    style={{
                      width: `${Math.min(260, (dw / dh) * 140)}px`,
                      height: `${Math.min(140, (dh / dw) * 260)}px`,
                    }}
                  >
                     <div className="absolute inset-0 rounded-[var(--radius-md)] ring-1 ring-black/10 dark:ring-white/10 inset-ring inset-ring-white/20"></div>
                    <span className="text-white text-xs font-mono font-bold tracking-wider drop-shadow-md relative z-20">
                      {detectedRatio}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={clearDetect} className="text-sm px-4">Clear Results</Button>
              </div>
            </Panel>
          )}
        </>
      )}

      {mode === "scale" && (
        <>
          <Panel>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Input
                        label="Aspect Ratio"
                        value={ratioStr}
                        onChange={(e) => { setRatioStr(e.target.value); clearScale(); }}
                        placeholder="e.g. 16:9"
                        helperText={scaleError || "Enter as W:H, e.g. 16:9 or 4:3"}
                        className="font-mono text-lg"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                        {PRESETS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => applyPreset(p.w, p.h)}
                            className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-mono border transition-all duration-200 cursor-pointer ${
                            ratioStr === `${p.w / gcd(p.w, p.h)}:${p.h / gcd(p.w, p.h)}`
                                ? "bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)] shadow-sm font-semibold"
                                : "bg-[var(--surface-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary-400)] hover:bg-[var(--surface-elevated)]"
                            }`}
                        >
                            {p.label}
                        </button>
                        ))}
                    </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                 <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Calculated Dimensions</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-transparent dark:from-[var(--color-primary-900)] opacity-20 transition-opacity group-hover:opacity-40"></div>
                    <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1 relative z-10">Width</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight relative z-10">
                      {scaleW || scaledW}
                      <span className="text-sm font-medium text-[var(--text-tertiary)] ml-1">px</span>
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-transparent dark:from-[var(--color-primary-900)] opacity-20 transition-opacity group-hover:opacity-40"></div>
                    <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1 relative z-10">Height</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono tracking-tight relative z-10">
                      {scaleH || scaledH}
                      <span className="text-sm font-medium text-[var(--text-tertiary)] ml-1">px</span>
                    </p>
                  </div>
                </div>

                {/* Visual preview */}
                {(() => {
                  const w = parseFloat(scaleW || scaledW);
                  const h = parseFloat(scaleH || scaledH);
                  if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                    return (
                        <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] border border-[var(--border-default)] p-6 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                             <div className="absolute inset-0 bg-[var(--border-default)] opacity-10" style={{ backgroundImage: "radial-gradient(var(--border-primary) 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
                            <div
                                className="bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] rounded-[var(--radius-md)] shadow-md flex items-center justify-center transition-all duration-300 ease-out relative z-10 ring-4 ring-[var(--surface-primary)] dark:ring-[var(--surface-secondary)]"
                                style={{
                                width: `${Math.min(260, (w / h) * 140)}px`,
                                height: `${Math.min(140, (h / w) * 260)}px`,
                                }}
                            >
                                <div className="absolute inset-0 rounded-[var(--radius-md)] ring-1 ring-black/10 dark:ring-white/10 inset-ring inset-ring-white/20"></div>
                                <span className="text-white text-xs font-mono font-bold tracking-wider drop-shadow-md relative z-20">
                                {ratioStr}
                                </span>
                            </div>
                        </div>
                    );
                  }
                  return null;
                })()}
              </div>
               <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={clearScale} className="text-sm px-4">Clear Results</Button>
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}