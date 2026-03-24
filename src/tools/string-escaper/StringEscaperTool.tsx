import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { toTitleCase } from "@/lib/utils";
import { Box, Container } from "@/components/layout/Primitive";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

type EscapeMode = "javascript" | "json" | "html" | "csv" | "sql";

const MODES: { id: EscapeMode; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "csv", label: "CSV" },
  { id: "sql", label: "SQL" },
];

function escapeString(text: string, mode: EscapeMode): string {
  if (!text) return "";
  switch (mode) {
    case "javascript":
      return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\0/g, "\\0");
    case "json":
      return JSON.stringify(text).slice(1, -1); // Remove surrounding quotes
    case "html":
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    case "csv":
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return '"' + text.replace(/"/g, '""') + '"';
      }
      return text;
    case "sql":
      return text.replace(/'/g, "''");
    default:
      return text;
  }
}

function unescapeString(text: string, mode: EscapeMode): string {
  if (!text) return "";
  switch (mode) {
    case "javascript":
    case "json":
      try {
        return JSON.parse(`"${text}"`);
      } catch {
        return text
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, "\\");
      }
    case "html": {
      const el = document.createElement("textarea");
      el.innerHTML = text;
      return el.value;
    }
    case "csv":
      if (text.startsWith('"') && text.endsWith('"')) {
        return text.slice(1, -1).replace(/""/g, '"');
      }
      return text;
    case "sql":
      return text.replace(/''/g, "'");
    default:
      return text;
  }
}

export default function StringEscaperTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("javascript");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");

  const output = useMemo(() => {
    return direction === "escape"
      ? escapeString(input, mode)
      : unescapeString(input, mode);
  }, [input, mode, direction]);


  return (
    <Container>
      <Panel>
        <Tabs value={direction} onValueChange={v => setDirection(v as "escape" | "unescape")}>
          <TabList>
            {["escape", "unescape"].map(d => (
              <Tab key={d} value={d}>
                {toTitleCase(d)}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Panel>
      <Container cols={2}>
        <Box>
          <Panel>
            <Select
              label="Mode"
              value={mode} onValueChange={v => setMode(v as EscapeMode)}>
              <SelectTrigger>
                {MODES.find(m => m.id === mode)?.label}
              </SelectTrigger>
              <SelectContent>
                {MODES.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={input}
              label="Input"
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter string to ${direction}...`}
              allowCopy={false}
              handlePaste={setInput}
            />
          </Panel>
        </Box>
        <Box>
          <Panel>
            <Textarea
              value={output}
              label="Output"
              readOnly
              allowCopy={true}
            />
          </Panel>
        </Box>
      </Container>
    </Container>

  );
}
