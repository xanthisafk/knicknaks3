import { useState } from "react";
import { Button, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { toTitleCase } from "@/lib/utils";
import { ChevronsDownUpIcon, CornerDownLeft, FlaskConical, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import CodeBlock from "@/components/advanced/CodeBlock";

type IndentStyle = "2" | "4" | "tab";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentStyle>("2");
  const [error, setError] = useState("");

  const format = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : parseInt(indent);
      setOutput(JSON.stringify(parsed, null, space));
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Invalid JSON").replace("JSON.parse: ", ""));
      setOutput("");
    }
  };

  const minify = () => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Invalid JSON").replace("JSON.parse: ", ""));
      setOutput("");
    }
  };

  const handleSampleJson = () => {
    const sample = JSON.stringify({
      app: {
        name: "Knicknaks",
        version: "3.1.0",
        environment: "production",
        modules: [
          {
            id: "auth",
            enabled: true,
            strategies: {
              oauth: {
                providers: [
                  { name: "google", scopes: ["email", "profile"] },
                  { name: "github", scopes: ["repo", "user"] }
                ]
              },
              jwt: {
                expiry: 3600,
                refresh: { enabled: true, window: 7200 }
              }
            }
          },
          {
            id: "analytics",
            enabled: false,
            config: {
              sampling: { rate: 0.25, strategy: "adaptive" },
              pipelines: [
                {
                  name: "events",
                  stages: [
                    { type: "filter", rules: [{ field: "type", op: "neq", value: "debug" }] },
                    { type: "transform", fn: "normalizeEvent" }
                  ]
                }
              ]
            }
          }
        ]
      }
    });
    setInput(sample);
  };

  return (
    <div className="space-y-2">
      <Panel>
        <Textarea
          value={input}
          label="Input JSON"
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here... e.g. {"key": "value"}'
          rows={10}
        />
      </Panel>
      {error && (
        <Panel padding="sm">
          <Label size="s" className="text-(--color-error)! font-mono" role="alert">
            {error}
          </Label>
        </Panel>
      )}
      <Panel className="space-x-2 flex flex-col md:flex-row justify-between">
        <div className="space-x-2 flex flex-col md:flex-row gap-2">
          <div className="min-w-50">
            <Select value={indent} onValueChange={v => setIndent(v as IndentStyle)}>
              <SelectTrigger>
                Indent: {toTitleCase(indent)}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button icon={Pencil} className="min-w-50" onClick={format}>Format</Button>
          <Button icon={ChevronsDownUpIcon} variant="secondary" onClick={minify}>
            Minify
          </Button>
        </div>
        <div>
          <Button icon={FlaskConical} onClick={handleSampleJson} variant="ghost">
            Sample
          </Button>
          <Button
            variant="secondary"
            icon={CornerDownLeft}
            onClick={() => {
              setInput("");
              setOutput("");
              setError("");
            }}
          >
            Clear
          </Button>
        </div>
      </Panel>
      {output &&
        <Panel>
          <CodeBlock
            code={output}
            langHint="json"
            label="Output JSON"
          />
        </Panel>}
    </div>
  );
}
