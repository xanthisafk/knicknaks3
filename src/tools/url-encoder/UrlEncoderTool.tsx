import { useState, useCallback } from "react";
import { Label, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { TriangleAlert } from "lucide-react";

export default function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [componentMode, setComponentMode] = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [error, setError] = useState("");

  const processInput = useCallback(
    (text: string, processMode: "encode" | "decode", isComponent: boolean) => {
      setError("");
      if (!text.trim()) {
        setOutput("");
        return;
      }
      try {
        if (processMode === "encode") {
          setOutput(isComponent ? encodeURIComponent(text) : encodeURI(text));
        } else {
          setOutput(isComponent ? decodeURIComponent(text) : decodeURI(text));
        }
      } catch {
        setError("Invalid input. Could not " + processMode + " the text.");
        setOutput("");
      }
    },
    []
  );

  const handleInputChange = (text: string) => {
    setInput(text);
    if (liveMode) processInput(text, mode, componentMode);
  };


  return (
    <Container cols={2}>
      <Panel>
        <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
          <TabList>
            <Tab value="encode">Encode</Tab>
            <Tab value="decode">Decode</Tab>
          </TabList>
        </Tabs>
        <Textarea
          label="Input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          handlePaste={handleInputChange}
          onClear={() => { setInput(""); setOutput(""); setError(""); }}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter encoded URL to decode..."}
        />
        <Container cols={2}>
          <Toggle
            label="Component mode"
            checked={componentMode}
            onChange={(checked) => {
              setComponentMode(checked);
              if (liveMode && input) processInput(input, mode, checked);
            }}
          />
          <Toggle label="Live" checked={liveMode} onChange={setLiveMode} />
        </Container>
        {error && (
          <Label variant="danger" icon={TriangleAlert}>{error}</Label>
        )}
      </Panel>
      <Panel>
        <Textarea
          label="Output"
          value={output}
          readOnly
          placeholder="Output will appear here..."
          rows={12}
        />
      </Panel>
    </Container>

  );
}
