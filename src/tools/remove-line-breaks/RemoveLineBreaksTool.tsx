import { useState, useMemo } from "react";
import { Button, Textarea, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const PRESETS = [
  { label: "Space", value: " " },
  { label: "Comma", value: ", " },
  { label: "Semicolon", value: "; " },
  { label: "Dot", value: " . " },
  { label: "Slash", value: "/" },
  { label: "Pipe", value: " | " },
  { label: "None", value: "" },
];

export default function RemoveLineBreaksTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState(" ");

  const output = useMemo(() => {
    if (!input) return "";
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(separator);
  }, [input, separator]);




  return (
    <Container cols={2}>
      <Box>
        <Panel className="flex flex-col gap-3">
          <Textarea
            label="Input"
            placeholder={"Line one\nLine two\nLine three"}
            allowCopy={false}
            handlePaste={setInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select
              label="Preset"
              value={separator}
              onValueChange={setSeparator}>
              <SelectTrigger>
                {PRESETS.find((p) => p.value === separator)?.label ?? "Custom"}
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.label} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Separator"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              handlePaste={setSeparator}
            />
          </div>
        </Panel>
      </Box>

      <Box>
        <Panel>
          <Textarea
            label="Output"
            value={output}
            disabled
          />
        </Panel>
      </Box>
    </Container>
  );
}
