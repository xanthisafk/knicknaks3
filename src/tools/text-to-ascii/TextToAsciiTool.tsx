import { useState } from "react";
import { Textarea, Label, ExpectContent } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DisplayFormat = "decimal" | "hex" | "octal" | "binary";

function textToAscii(text: string, format: DisplayFormat): string {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      switch (format) {
        case "decimal": return code.toString(10);
        case "hex": return "0x" + code.toString(16).toUpperCase().padStart(2, "0");
        case "octal": return "0o" + code.toString(8);
        case "binary": return code.toString(2).padStart(8, "0");
      }
    })
    .join("  ");
}

const FORMAT_LABELS: { value: DisplayFormat; label: string }[] = [
  { value: "decimal", label: "Dec" },
  { value: "hex", label: "Hex" },
  { value: "octal", label: "Oct" },
  { value: "binary", label: "Bin" },
];

export default function TextToAsciiTool() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<DisplayFormat>("decimal");

  const output = text ? textToAscii(text, format) : "";

  const rows = text
    ? text.split("").map((ch) => ({
      char: ch === " " ? "·" : ch === "\n" ? "↵" : ch,
      decimal: ch.charCodeAt(0),
      hex: "0x" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
      octal: "0o" + ch.charCodeAt(0).toString(8),
      binary: ch.charCodeAt(0).toString(2).padStart(8, "0"),
    }))
    : [];

  return (
    <Container>
      <Container cols={2}>
        <Box>
          <Panel>
            <Textarea
              label="Text Input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              handlePaste={setText}
              placeholder="Type something to convert to ASCII codes..."
            />
            <Select
              label="Format"
              value={format}
              onValueChange={v => setFormat(v as DisplayFormat)}
            >
              <SelectTrigger>
                {FORMAT_LABELS.find(f => f.value === format)?.label}
              </SelectTrigger>
              <SelectContent>
                {FORMAT_LABELS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Panel>
        </Box>

        <Panel>
          {output ? <Textarea
            label="ASCII Output"
            value={output}
            readOnly
            placeholder="ASCII codes appear here..."
            rows={11}
          /> : <ExpectContent text="ASCII codes will show up here" emoji="≽^•⩊•^≼" />}

        </Panel>

      </Container>
      {rows.length > 0 && rows.length <= 80 && <Box>
        <Panel>
          <Label>Character Table</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Decimal</TableHead>
                <TableHead>Hex</TableHead>
                <TableHead>Octal</TableHead>
                <TableHead>Binary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.char}</TableCell>
                  <TableCell>{row.decimal}</TableCell>
                  <TableCell>{row.hex}</TableCell>
                  <TableCell>{row.octal}</TableCell>
                  <TableCell>{row.binary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </Box>}
    </Container>
  );
}