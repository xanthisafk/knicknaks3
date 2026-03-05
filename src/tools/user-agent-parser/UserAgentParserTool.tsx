import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

interface UAResult {
  browser: { name: string; version: string };
  engine: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  isBot: boolean;
  raw: string;
}

function parseUA(ua: string): UAResult {
  const s = ua.trim();

  // Browser detection
  let browserName = "Unknown";
  let browserVersion = "";

  if (/Edg\/(\S+)/.test(s)) { browserName = "Edge"; browserVersion = s.match(/Edg\/(\S+)/)![1]; }
  else if (/OPR\/(\S+)/.test(s)) { browserName = "Opera"; browserVersion = s.match(/OPR\/(\S+)/)![1]; }
  else if (/SamsungBrowser\/(\S+)/.test(s)) { browserName = "Samsung Browser"; browserVersion = s.match(/SamsungBrowser\/(\S+)/)![1]; }
  else if (/YaBrowser\/(\S+)/.test(s)) { browserName = "Yandex Browser"; browserVersion = s.match(/YaBrowser\/(\S+)/)![1]; }
  else if (/UCBrowser\/(\S+)/.test(s)) { browserName = "UC Browser"; browserVersion = s.match(/UCBrowser\/(\S+)/)![1]; }
  else if (/CriOS\/(\S+)/.test(s)) { browserName = "Chrome (iOS)"; browserVersion = s.match(/CriOS\/(\S+)/)![1]; }
  else if (/FxiOS\/(\S+)/.test(s)) { browserName = "Firefox (iOS)"; browserVersion = s.match(/FxiOS\/(\S+)/)![1]; }
  else if (/Chrome\/(\S+)/.test(s) && !/Chromium/.test(s)) { browserName = "Chrome"; browserVersion = s.match(/Chrome\/(\S+)/)![1]; }
  else if (/Chromium\/(\S+)/.test(s)) { browserName = "Chromium"; browserVersion = s.match(/Chromium\/(\S+)/)![1]; }
  else if (/Firefox\/(\S+)/.test(s)) { browserName = "Firefox"; browserVersion = s.match(/Firefox\/(\S+)/)![1]; }
  else if (/Safari\/(\S+)/.test(s) && /Version\/(\S+)/.test(s)) { browserName = "Safari"; browserVersion = s.match(/Version\/(\S+)/)![1]; }
  else if (/MSIE\s(\S+)/.test(s)) { browserName = "Internet Explorer"; browserVersion = s.match(/MSIE\s(\S+)/)![1].replace(";",""); }
  else if (/Trident\/.*rv:(\S+)/.test(s)) { browserName = "Internet Explorer"; browserVersion = s.match(/rv:(\S+)/)![1].replace(")",""); }

  // Engine detection
  let engineName = "Unknown";
  let engineVersion = "";
  if (/AppleWebKit\/(\S+)/.test(s)) { engineName = "WebKit"; engineVersion = s.match(/AppleWebKit\/(\S+)/)![1]; }
  else if (/Gecko\/(\S+)/.test(s)) { engineName = "Gecko"; engineVersion = s.match(/Gecko\/(\S+)/)![1]; }
  else if (/Trident\/(\S+)/.test(s)) { engineName = "Trident"; engineVersion = s.match(/Trident\/(\S+)/)![1]; }
  else if (/Presto\/(\S+)/.test(s)) { engineName = "Presto"; engineVersion = s.match(/Presto\/(\S+)/)![1]; }

  // OS detection
  let osName = "Unknown";
  let osVersion = "";
  if (/Windows NT (\S+)/.test(s)) {
    const ver = s.match(/Windows NT (\S+)/)![1].replace(";","");
    const map: Record<string, string> = { "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7", "6.0": "Vista", "5.2": "XP x64", "5.1": "XP" };
    osName = "Windows"; osVersion = map[ver] || ver;
  } else if (/Mac OS X ([\d_.]+)/.test(s)) {
    osName = "macOS"; osVersion = s.match(/Mac OS X ([\d_.]+)/)![1].replace(/_/g, ".");
  } else if (/Android ([\d.]+)/.test(s)) {
    osName = "Android"; osVersion = s.match(/Android ([\d.]+)/)![1];
  } else if (/iPhone OS ([\d_]+)/.test(s)) {
    osName = "iOS"; osVersion = s.match(/iPhone OS ([\d_]+)/)![1].replace(/_/g, ".");
  } else if (/iPad; CPU OS ([\d_]+)/.test(s)) {
    osName = "iPadOS"; osVersion = s.match(/CPU OS ([\d_]+)/)![1].replace(/_/g, ".");
  } else if (/Linux/.test(s) && /Ubuntu|Debian|Fedora|CentOS|Arch/.test(s)) {
    osName = s.match(/(Ubuntu|Debian|Fedora|CentOS|Arch)/)![1];
  } else if (/Linux/.test(s)) {
    osName = "Linux";
  } else if (/CrOS/.test(s)) {
    osName = "ChromeOS";
  }

  // Device detection
  let deviceType = "Desktop";
  let deviceVendor = "";
  let deviceModel = "";

  if (/Mobi|iPhone|Android.*Mobile|BlackBerry|IEMobile/.test(s)) {
    deviceType = "Mobile";
  } else if (/iPad|Tablet|Kindle|PlayBook/.test(s)) {
    deviceType = "Tablet";
  }

  if (/iPhone/.test(s)) { deviceVendor = "Apple"; deviceModel = "iPhone"; }
  else if (/iPad/.test(s)) { deviceVendor = "Apple"; deviceModel = "iPad"; }
  else if (/Pixel (\d)/.test(s)) { deviceVendor = "Google"; deviceModel = "Pixel " + s.match(/Pixel (\d)/)![1]; }
  else if (/Samsung|SM-[A-Z]/.test(s)) { deviceVendor = "Samsung"; }
  else if (/Nexus/.test(s)) { deviceVendor = "Google"; deviceModel = s.match(/Nexus \S+/)![0]; }
  else if (/Macintosh/.test(s)) { deviceVendor = "Apple"; deviceModel = "Mac"; }
  else if (/Windows/.test(s)) { deviceVendor = "PC"; }

  // Bot detection
  const isBot = /bot|crawl|spider|slurp|baiduspider|yandex|duckduck|bingpreview|googlebot|facebookexternalhit|twitterbot|linkedinbot/i.test(s);

  return {
    browser: { name: browserName, version: browserVersion },
    engine: { name: engineName, version: engineVersion },
    os: { name: osName, version: osVersion },
    device: { type: deviceType, vendor: deviceVendor, model: deviceModel },
    isBot,
    raw: s,
  };
}

const DEVICE_ICONS: Record<string, string> = {
  Mobile: "📱",
  Tablet: "📲",
  Desktop: "🖥️",
};

function Badge({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  if (!value || value === "Unknown") return null;
  return (
    <div
      className={`rounded-[var(--radius-md)] border px-3 py-2 ${
        accent
          ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10"
          : "border-[var(--border-default)] bg-[var(--surface-elevated)]"
      }`}
    >
      <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{label}</div>
      <div className={`font-mono text-sm font-semibold ${accent ? "text-[var(--color-primary-500)]" : "text-[var(--text-primary)]"}`}>
        {value}
      </div>
    </div>
  );
}

export default function UserAgentParserTool() {
  const [ua, setUa] = useState("");
  const [useOwn, setUseOwn] = useState(false);

  const displayUa = useOwn ? navigator.userAgent : ua;
  const result = displayUa.trim() ? parseUA(displayUa) : null;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              User Agent String
            </label>
            <Textarea
              value={useOwn ? navigator.userAgent : ua}
              onChange={(e) => { setUa(e.target.value); setUseOwn(false); }}
              placeholder="Paste a User Agent string to parse…"
              className="min-h-[80px] font-mono text-xs"
              readOnly={useOwn}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="text-sm px-4 py-2"
              onClick={() => setUseOwn((v) => !v)}
            >
              {useOwn ? "✓ Using your browser" : "Use my browser's UA"}
            </Button>
            {(ua || useOwn) && (
              <button
                className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => { setUa(""); setUseOwn(false); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Panel>

      {result && (
        <>
          {result.isBot && (
            <Panel>
              <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="font-semibold">Bot / Crawler Detected</div>
                  <div className="text-sm opacity-75">This user agent appears to be an automated bot or web crawler.</div>
                </div>
              </div>
            </Panel>
          )}

          <Panel>
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
              Parsed Results
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Badge label="Browser" value={`${result.browser.name}${result.browser.version ? " " + result.browser.version.split(".")[0] : ""}`} accent />
              <Badge label="Engine" value={`${result.engine.name} ${result.engine.version.split(".")[0]}`} />
              <Badge label="OS" value={`${result.os.name}${result.os.version ? " " + result.os.version : ""}`} />
              <Badge
                label="Device Type"
                value={`${DEVICE_ICONS[result.device.type] || ""} ${result.device.type}`}
              />
              {result.device.vendor && <Badge label="Vendor" value={result.device.vendor} />}
              {result.device.model && <Badge label="Model" value={result.device.model} />}
            </div>
          </Panel>

          <Panel>
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
              Full Detail
            </h3>
            <div className="space-y-1.5">
              {[
                ["Browser Name", result.browser.name],
                ["Browser Version", result.browser.version],
                ["Engine Name", result.engine.name],
                ["Engine Version", result.engine.version],
                ["OS Name", result.os.name],
                ["OS Version", result.os.version],
                ["Device Type", result.device.type],
                ["Device Vendor", result.device.vendor],
                ["Device Model", result.device.model],
                ["Bot", result.isBot ? "Yes" : "No"],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm border-b border-[var(--border-subtle)] last:border-b-0 py-1.5"
                  >
                    <span className="text-[var(--text-tertiary)] w-36 shrink-0">{label}</span>
                    <span className="font-mono text-[var(--text-primary)] text-right break-all">{value}</span>
                  </div>
                ))}
            </div>
          </Panel>
        </>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>Click "Use my browser's UA" to auto-fill with your current browser's string.</li>
          <li>Supports Chrome, Firefox, Safari, Edge, Opera, Samsung Browser, and more.</li>
          <li>Bots and crawlers (e.g. Googlebot) are flagged automatically.</li>
        </ul>
      </Panel>
    </div>
  );
}