import { useState } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toTitleCase } from "@/lib";

type BitGroup = 8 | 16 | 32;
type Separator = "space" | "dash" | "none";

function textToBinary(text: string, bits: BitGroup, sep: Separator): string {
  const sepChar = sep === "space" ? " " : sep === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(bits, "0"))
    .join(sepChar);
}

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/[^01]/g, "");
  const chunks: string[] = [];
  for (let i = 0; i + 8 <= cleaned.length; i += 8) {
    chunks.push(cleaned.slice(i, i + 8));
  }
  return chunks.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

const BIT_OPTIONS: BitGroup[] = [8, 16, 32];
const SEP_OPTIONS: { value: Separator; label: string }[] = [
  { value: "space", label: "Space" },
  { value: "dash", label: "Dash" },
  { value: "none", label: "None" },
];

export default function TextToBinaryTool() {
  const [text, setText] = useState("");
  const [bits, setBits] = useState<BitGroup>(8);
  const [sep, setSep] = useState<Separator>("space");

  const binary = text ? textToBinary(text, bits, sep) : "";
  const bitCount = text.split("").reduce((a, ch) => a + ch.charCodeAt(0).toString(2).padStart(bits, "0").length, 0);

  const handleBinaryChange = (val: string) => {
    setText(binaryToText(val));
  };


  return (
    <Container cols={2}>
      <Panel>
        <Textarea
          label="Input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          handlePaste={setText}
          placeholder="Type text to convert to binary..."
        />
        <Container cols={2}>
          <Select
            label="Bit Width"
            value={`${bits}`}
            onValueChange={v => setBits(Number(v) as BitGroup)}
          >
            <SelectTrigger>
              {bits} bits
            </SelectTrigger>
            <SelectContent>
              {BIT_OPTIONS.map(b => (
                <SelectItem key={b} value={`${b}`}>
                  {b} bits
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            label="Separator"
            value={sep}
            onValueChange={v => setSep(v as Separator)}
          >
            <SelectTrigger>
              {toTitleCase(sep)}
            </SelectTrigger>
            <SelectContent>
              {SEP_OPTIONS.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Container>
      </Panel>
      <Panel>
        <Textarea
          label="Output"
          value={binary}
          onChange={(e) => handleBinaryChange(e.target.value)}
          handlePaste={handleBinaryChange}
          placeholder="Binary output appears here... or paste binary to decode"
          className="font-mono"
          rows={10}
          helperText={`${bitCount} bits · ${text.length} char${text.length !== 1 ? "s" : ""}`}
        />
      </Panel>
    </Container>
  );
}