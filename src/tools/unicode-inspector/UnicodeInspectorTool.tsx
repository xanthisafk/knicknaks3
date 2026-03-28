import { useState } from "react";
import { Textarea, Button, Label, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import StatBox from "@/components/ui/StatBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CodePointInfo {
  char: string;
  display: string;
  codePoint: number;
  codePointHex: string;
  utf8Bytes: string;
  utf16Bytes: string;
  category: string;
  name: string;
  isEmoji: boolean;
}

function getUtf8Bytes(cp: number): string {
  if (cp < 0x80) return cp.toString(16).padStart(2, "0").toUpperCase();
  if (cp < 0x800) {
    const b1 = 0xc0 | (cp >> 6);
    const b2 = 0x80 | (cp & 0x3f);
    return [b1, b2].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  if (cp < 0x10000) {
    const b1 = 0xe0 | (cp >> 12);
    const b2 = 0x80 | ((cp >> 6) & 0x3f);
    const b3 = 0x80 | (cp & 0x3f);
    return [b1, b2, b3].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  }
  const b1 = 0xf0 | (cp >> 18);
  const b2 = 0x80 | ((cp >> 12) & 0x3f);
  const b3 = 0x80 | ((cp >> 6) & 0x3f);
  const b4 = 0x80 | (cp & 0x3f);
  return [b1, b2, b3, b4].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function getUtf16Bytes(cp: number): string {
  if (cp < 0x10000) {
    return cp.toString(16).padStart(4, "0").toUpperCase();
  }
  const adjusted = cp - 0x10000;
  const high = 0xd800 + (adjusted >> 10);
  const low = 0xdc00 + (adjusted & 0x3ff);
  return [high, low].map((b) => b.toString(16).padStart(4, "0").toUpperCase()).join(" ");
}

function getCategory(cp: number): string {
  if (cp < 0x20) return "Control";
  if (cp < 0x7f) return "Basic Latin";
  if (cp < 0xa0) return "C1 Control";
  if (cp < 0x100) return "Latin-1 Supplement";
  if (cp < 0x250) return "Latin Extended";
  if (cp >= 0x370 && cp < 0x400) return "Greek";
  if (cp >= 0x400 && cp < 0x500) return "Cyrillic";
  if (cp >= 0x600 && cp < 0x700) return "Arabic";
  if (cp >= 0x4e00 && cp < 0xa000) return "CJK Unified";
  if (cp >= 0x1f300 && cp < 0x1fa00) return "Emoji";
  if (cp >= 0xd800 && cp < 0xe000) return "Surrogate";
  return "Other Unicode";
}

function isEmoji(cp: number): boolean {
  return (cp >= 0x1f300 && cp < 0x1fa00) || (cp >= 0x2600 && cp < 0x2700);
}

function analyzeText(text: string): CodePointInfo[] {
  const results: CodePointInfo[] = [];
  for (const char of text) {
    const cp = char.codePointAt(0)!;
    const hex = cp.toString(16).toUpperCase().padStart(4, "0");
    const isCtrl = cp < 0x20 || cp === 0x7f;
    results.push({
      char,
      display: isCtrl ? `U+${hex}` : char,
      codePoint: cp,
      codePointHex: `U+${hex}`,
      utf8Bytes: getUtf8Bytes(cp),
      utf16Bytes: getUtf16Bytes(cp),
      category: getCategory(cp),
      name: `U+${hex}`,
      isEmoji: isEmoji(cp),
    });
  }
  return results;
}

export default function UnicodeInspectorTool() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<CodePointInfo | null>(null);

  const chars = text ? analyzeText(text) : [];
  const charSet = Array.from(
    new Map(chars.map(c => [c.codePoint, c])).values()
  );
  const uniqueCount = charSet.length;
  const totalBytes = chars.reduce((sum, c) => sum + getUtf8Bytes(c.codePoint).split(" ").length, 0);

  const handleInput = (text: string) => {
    setText(text);
    setSelected(null);
  }

  return (
    <Container>
      <Panel>
        <Textarea
          label="Input Text"
          value={text}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Enter any text..."
          handlePaste={handleInput}
          onClear={() => handleInput("")}
        />
      </Panel>
      {text && <Container cols={4} mobileCols={2}>
        <StatBox label="Characters" value={chars.length} textSize="5xl" />
        <StatBox label="Unique" value={uniqueCount} textSize="5xl" />
        <StatBox label="UTF-8 Bytes" value={totalBytes} textSize="5xl" />
        <StatBox label="Code Points" value={chars.length} textSize="5xl" />
      </Container>}

      {chars.length > 0 && (
        <Panel>
          <Label>Character Map (Click to select)</Label>
          <div className="flex flex-wrap gap-1 max-h-96 overflow-y-auto">
            {charSet.map((info) => (
              <Button
                key={info.codePoint}
                onClick={() =>
                  setSelected(
                    selected?.codePoint === info.codePoint ? null : info
                  )
                }
                title={info.codePointHex}
                variant={selected?.codePoint === info.codePoint ? "primary" : "secondary"}
                size="sm"
                className="border-0"
              >
                {info.display}
              </Button>
            ))}
          </div>


          {selected && (
            <Box>
              <Container cols={2}>
                {[
                  ["Code Point", selected.codePointHex],
                  ["Category", selected.category],
                  ["UTF-8 Bytes", selected.utf8Bytes],
                  ["UTF-16", selected.utf16Bytes],
                  ["Decimal", selected.codePoint.toString()],
                  ["Octal", "0o" + selected.codePoint.toString(8)],
                  ["HTML Entity", `&#${selected.codePoint};`],
                  ["CSS Escape", `\\${selected.codePoint.toString(16).toUpperCase()}`],
                ].map(([label, val]) => (
                  <Input
                    key={label}
                    label={label}
                    disabled
                    allowCopy
                    value={val}
                  />
                ))}
              </Container>
            </Box>


          )}
        </Panel>
      )
      }

      {/* Full table for small inputs */}
      {
        charSet.length > 0 && (
          <Panel>
            <div className="overflow-x-auto max-h-96">
              <Label>Full Breakdown</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Char</TableHead>
                    <TableHead>Code Point</TableHead>
                    <TableHead>UTF-8</TableHead>
                    <TableHead>UTF-16</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charSet.map((info) => (
                    <TableRow key={info.codePoint}>
                      <TableCell>{info.display}</TableCell>
                      <TableCell>{info.codePointHex}</TableCell>
                      <TableCell>{info.utf8Bytes}</TableCell>
                      <TableCell>{info.utf16Bytes}</TableCell>
                      <TableCell>{info.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        )
      }
    </Container>
  );
}