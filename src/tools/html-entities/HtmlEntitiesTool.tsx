import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { CornerDownLeft } from "lucide-react";

function encodeHtmlEntities(text: string): string {
  const el = document.createElement("textarea");
  el.textContent = text;
  return el.innerHTML;
}

function decodeHtmlEntities(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleInputChange = (text: string) => {
    setInput(text);
    setOutput(mode === "encode" ? encodeHtmlEntities(text) : decodeHtmlEntities(text));
  };

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    setOutput(newMode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
  };


  return (
    <div className="space-y-2">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={mode} onValueChange={e => handleModeChange(e as "encode" | "decode")}>
            <TabList>
              <Tab value="encode">Encode</Tab>
              <Tab value="decode">Decode</Tab>
            </TabList>
          </Tabs>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" icon={CornerDownLeft} onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>
          </div>
        </div>
      </Panel>
      <Panel>
        <Textarea
          value={input}
          label="Input"
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={mode === "encode" ? '<div class="hello">&</div>' : "&lt;div class=&quot;hello&quot;&gt;&amp;&lt;/div&gt;"}
          rows={10}
          className="font-mono"
        />
      </Panel>
      <Panel>
        <Textarea
          value={output}
          label="Output"
          readOnly
          rows={10}
          placeholder="Converted text will appear here..."
          className="font-mono"
        />
      </Panel>
    </div>
  );
}
