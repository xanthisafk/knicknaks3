import { useState } from "react";
import { Button, ExpectContent, Label, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Check, Globe, Trash2 } from "lucide-react";
import { ResultRow } from "@/components/advanced/ResultRow";

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
  else if (/MSIE\s(\S+)/.test(s)) { browserName = "Internet Explorer"; browserVersion = s.match(/MSIE\s(\S+)/)![1].replace(";", ""); }
  else if (/Trident\/.*rv:(\S+)/.test(s)) { browserName = "Internet Explorer"; browserVersion = s.match(/rv:(\S+)/)![1].replace(")", ""); }

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
    const ver = s.match(/Windows NT (\S+)/)![1].replace(";", "");
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


export default function UserAgentParserTool() {
  const [ua, setUa] = useState("");
  const [useOwn, setUseOwn] = useState(false);

  const displayUa = useOwn ? navigator.userAgent : ua;
  const result = displayUa.trim() ? parseUA(displayUa) : null;

  const handleInputChange = (text: string) => {
    setUa(text);
    setUseOwn(false);
  }

  return (
    <div className="space-y-2">
      <Container>
        <Panel>
          <Input
            label="User Agent String"
            value={useOwn ? navigator.userAgent : ua}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste a User Agent string to parse..."
            handlePaste={handleInputChange}
            allowCopy={true}
            onClear={() => handleInputChange("")}
          />
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <Button
              onClick={() => setUseOwn(true)}
              icon={useOwn ? Check : Globe}
              disabled={useOwn}
              variant={useOwn ? "secondary" : "primary"}
              className="border-0 w-full md:w-fit"
            >
              {useOwn ? "Using Your User Agent" : "Use My User Agent"}
            </Button>
            <Button
              onClick={() => handleInputChange("")}
              icon={Trash2}
              variant="ghost"
              className="border-0 w-full md:w-fit"
            >
              Clear
            </Button>
          </div>
        </Panel>
        {!result && (
          <Panel>
            <ExpectContent text="Enter a User Agent string to parse..." emoji="🥨" />
          </Panel>
        )}
        {result && <>
          <Panel>
            <Label>Parsed Results</Label>
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
              ["Bot", result.isBot ? "Likely" : "Unlikely"],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <ResultRow key={label} label={label} value={value} />
              ))}
          </Panel>
        </>}
      </Container>
    </div>
  );
}