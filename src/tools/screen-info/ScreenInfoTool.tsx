import { useState, useEffect } from "react";
import { Panel } from "@/components/layout";

interface ScreenData {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  dpr: number;
  colorDepth: number;
  orientation: string;
  touchSupport: boolean;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  language: string;
  languages: string;
  platform: string;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  colorScheme: string;
}

function getScreenData(): ScreenData {
  const isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    dpr: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientation: window.screen?.orientation?.type ?? "unknown",
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    cookiesEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
    language: navigator.language,
    languages: navigator.languages?.join(", ") ?? navigator.language,
    platform: navigator.platform ?? "unknown",
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
    colorScheme: isDark ? "Dark" : "Light",
  };
}

function InfoRow({ label, value, badge }: { label: string; value: string | number; badge?: "green" | "red" }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] hover:bg(--surface-bg) transition-colors">
      <span className="text-sm text(--text-secondary)">{label}</span>
      <span className="text-sm font-medium font-[family-name:var(--font-mono)] text(--text-primary) flex items-center gap-2">
        {badge && (
          <span
            className={`w-2 h-2 rounded-full ${badge === "green" ? "bg-green-500" : "bg-red-500"
              }`}
          />
        )}
        {value}
      </span>
    </div>
  );
}

export default function ScreenInfoTool() {
  const [data, setData] = useState<ScreenData>(getScreenData);

  useEffect(() => {
    const update = () => setData(getScreenData());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Headline stat */}
      <Panel>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Screen</p>
            <p className="text-lg font-bold text(--text-primary) font-[family-name:var(--font-mono)] tabular-nums">
              {data.screenWidth} x {data.screenHeight}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Viewport</p>
            <p className="text-lg font-bold text-[var(--color-primary-500)] font-[family-name:var(--font-mono)] tabular-nums">
              {data.viewportWidth} x {data.viewportHeight}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">DPR</p>
            <p className="text-lg font-bold text(--text-primary) font-[family-name:var(--font-mono)] tabular-nums">
              {data.dpr}x
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <h3 className="text-sm font-semibold text(--text-primary) mb-3">Display</h3>
          <div className="space-y-1.5">
            <InfoRow label="Screen Resolution" value={`${data.screenWidth} x ${data.screenHeight}`} />
            <InfoRow label="Viewport Size" value={`${data.viewportWidth} x ${data.viewportHeight}`} />
            <InfoRow label="Device Pixel Ratio" value={`${data.dpr}x`} />
            <InfoRow label="Color Depth" value={`${data.colorDepth}-bit`} />
            <InfoRow label="Orientation" value={data.orientation} />
            <InfoRow label="Color Scheme" value={data.colorScheme} />
          </div>
        </Panel>

        <Panel>
          <h3 className="text-sm font-semibold text(--text-primary) mb-3">Device & Browser</h3>
          <div className="space-y-1.5">
            <InfoRow label="Platform" value={data.platform} />
            <InfoRow label="CPU Cores" value={data.hardwareConcurrency || "N/A"} />
            <InfoRow label="Language" value={data.language} />
            <InfoRow label="Touch Support" value={data.touchSupport ? "Yes" : "No"} badge={data.touchSupport ? "green" : "red"} />
            <InfoRow label="Max Touch Points" value={data.maxTouchPoints} />
            <InfoRow label="Cookies" value={data.cookiesEnabled ? "Enabled" : "Disabled"} badge={data.cookiesEnabled ? "green" : "red"} />
            <InfoRow label="Online" value={data.onlineStatus ? "Yes" : "No"} badge={data.onlineStatus ? "green" : "red"} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
