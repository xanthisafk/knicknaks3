import { useState, useMemo } from "react";
import { Input, Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";
import { Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const PRESETS = [
  { label: "Newline", value: "\\n" },
  { label: "Space", value: " " },
  { label: "Comma", value: ", " },
  { label: "Pipe", value: " | " },
  { label: "None", value: "" },
];

export default function TextRepeaterTool() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [sep, setSep] = useState("\\n");
  const [copied, setCopied] = useState(false);

  const actualSep = sep === "\\n" ? "\n" : sep === "\\t" ? "\t" : sep;
  const output = useMemo(() =>
    text ? Array(Math.min(count, 1000)).fill(text).join(actualSep) : "",
    [text, count, actualSep]
  );

  const handleCopy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCountChange = (text: string) => {
    const value = parseInt(text);
    if (!isNaN(value)) {
      setCount(value);
    }
  };

  return (
    <Container>
      <Panel>
        <Textarea
          label="Text to repeat"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Hello!"
          handlePaste={setText}
        />
        <Container cols={3}>
          <Input
            label="Repeat count"
            type="number"
            value={count}
            onChange={e => handleCountChange(e.target.value)}
            handlePaste={handleCountChange}

          />
          <Select
            label="Presets"
            value={sep}
            onValueChange={v => setSep(v)}>
            <SelectTrigger>
              {(PRESETS.find(p => p.value === sep)?.label) || "Custom"}
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            label="Separator"
            value={sep}
            onChange={e => setSep(e.target.value)}
            handlePaste={setSep}
            placeholder="\n"
          />

        </Container>
      </Panel>

      {output && (
        <Panel>
          <Textarea
            label="Output"
            value={output}
            readOnly
          />
        </Panel>
      )}
    </Container>
  );
}
