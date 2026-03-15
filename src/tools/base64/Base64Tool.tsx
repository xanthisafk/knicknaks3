import { useState, useCallback } from "react";
import { Button, Label, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import { Tabs, TabList, Tab, } from "@/components/ui/tab";
import { CornerDownLeft } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const processInput = useCallback(
    (text: string, processMode: "encode" | "decode", isUrlSafe: boolean) => {
      setError("");
      if (!text.trim()) {
        setOutput("");
        return;
      }

      try {
        if (processMode === "encode") {
          let result = btoa(
            new TextEncoder()
              .encode(text)
              .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
          );
          if (isUrlSafe) {
            result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
          }
          setOutput(result);
        } else {
          let b64 = text.trim();
          if (isUrlSafe) {
            b64 = b64.replace(/-/g, "+").replace(/_/g, "/");
            while (b64.length % 4) b64 += "=";
          }
          const binary = atob(b64);
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          setOutput(new TextDecoder().decode(bytes));
        }
      } catch {
        setError(
          processMode === "decode"
            ? "Invalid Base64 input. Check your text and try again."
            : "Failed to encode. Unexpected error."
        );
        setOutput("");
      }
    },
    []
  );

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "encode" | "decode");
    if (liveMode && input) processInput(input, newMode as "encode" | "decode", urlSafe);
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    if (liveMode) processInput(text, mode, urlSafe);
  };

  const handleConvert = () => {
    processInput(input, mode, urlSafe);
  };

  const handleSwap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
    if (liveMode && output) processInput(output, newMode, urlSafe);
  };

  const handleCopy = async () => {
    if (await copyToClipboard(output)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      {/* Controls */}
      <Panel>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabList>
              <Tab value="encode">Encode</Tab>
              <Tab value="decode">Decode</Tab>
            </TabList>
          </Tabs>

          <div className="flex items-center gap-4 ml-auto">
            <Toggle
              label="URL-safe"
              checked={urlSafe}
              onChange={(checked) => {
                setUrlSafe(checked);
                if (liveMode && input) processInput(input, mode, checked);
              }}
            />
            <Toggle label="Live mode" checked={liveMode} onChange={setLiveMode} />
          </div>
        </div>
      </Panel>

      {/* Input / Output */}
      <div className="flex flex-col lg:flex-row gap-2">
        <Panel className="grow">
          <div className="space-y-2">
            <Textarea
              label="Input"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
              className="font-mono"
              rows={10}
            />
            <Label size="s">{input.length} chars</Label>
          </div>
        </Panel>

        <Panel className="grow">
          <div className="space-y-2">
            <Textarea
              label="Output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="font-mono"
              rows={10}
            />
          </div>
          <Label size="s">{output.length} chars</Label>
        </Panel>
      </div>

      {error && (
        <p className="text-sm text-error px-1" role="alert">
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {!liveMode && (
          <Button onClick={handleConvert}>
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
        )}
        <Button variant="secondary" onClick={handleSwap}>
          Swap Input ↔ Output
        </Button>
        <Button
          icon={CornerDownLeft}
          variant="ghost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}