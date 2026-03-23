import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

type Mode = "characters" | "words" | "lines";

function reverseText(text: string, mode: Mode): string {
  switch (mode) {
    case "characters":
      return [...text].reverse().join("");
    case "words":
      return text
        .split("\n")
        .map((line) => line.split(/\s+/).reverse().join(" "))
        .join("\n");
    case "lines":
      return text.split("\n").reverse().join("\n");
    default:
      return text;
  }
}

export default function ReverseTextTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("characters");

  const output = useMemo(() => reverseText(input, mode), [input, mode]);

  const MODES: { id: Mode; label: string }[] = [
    { id: "characters", label: "Characters" },
    { id: "words", label: "Words" },
    { id: "lines", label: "Lines" },
  ];

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello World"
            handlePaste={setInput}
            allowCopy={false}
            onClear={() => setInput("")}
          />
          <Select
            label="Reverse mode"
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
          >
            <SelectTrigger>
              {MODES.find((m) => m.id === mode)?.label}
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Panel>
      </Box>
      <Box>
        <Panel>
          <Textarea
            label="Output"
            value={output}
            placeholder="Output will show up here..."
            disabled
          />
        </Panel>
      </Box>
    </Container>
  );
}
