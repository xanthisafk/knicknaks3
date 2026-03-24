import { useState, useEffect } from "react";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { ResultRow } from "@/components/advanced/ResultRow";
import { Label } from "@/components/ui";
import StatBox from "@/components/ui/StatBox";

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
    <Container>
      <Container cols={3}>
        <StatBox textSize="xl" label="Screen" value={`${data.screenWidth} x ${data.screenHeight}`} />
        <StatBox textSize="xl" label="Viewport" value={`${data.viewportWidth} x ${data.viewportHeight}`} />
        <StatBox textSize="xl" label="DPR" value={`${data.dpr}x`} />
      </Container>

      <Container cols={2}>
        <Box>
          <Panel>
            <Label>Display</Label>
            <div className="space-y-1.5">
              <ResultRow label="Screen Resolution" value={`${data.screenWidth} x ${data.screenHeight}`} />
              <ResultRow label="Viewport Size" value={`${data.viewportWidth} x ${data.viewportHeight}`} />
              <ResultRow label="Device Pixel Ratio" value={`${data.dpr}x`} />
              <ResultRow label="Color Depth" value={`${data.colorDepth}-bit`} />
              <ResultRow label="Orientation" value={data.orientation} />
              <ResultRow label="Color Scheme" value={data.colorScheme} />
            </div>
          </Panel>
        </Box>

        <Box>
          <Panel>
            <Label>Device & Browser</Label>
            <div className="space-y-1.5">
              <ResultRow label="Platform" value={data.platform} />
              <ResultRow label="CPU Cores" value={`${data.hardwareConcurrency}`} />
              <ResultRow label="Language" value={data.language} />
              <ResultRow label="Touch Support" value={data.touchSupport ? "Yes" : "No"} />
              <ResultRow label="Max Touch Points" value={`${data.maxTouchPoints}`} />
              <ResultRow label="Cookies" value={data.cookiesEnabled ? "Enabled" : "Disabled"} />
              <ResultRow label="Online" value={data.onlineStatus ? "Yes" : "No"} />
            </div>
          </Panel>
        </Box>
      </Container>
    </Container>
  );
}
