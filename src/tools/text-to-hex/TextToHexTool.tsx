import { useState } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

type Case = "upper" | "lower";
type Prefix = "none" | "0x" | "\\x" | "%";
type Separator = "space" | "comma" | "colon" | "none";

function textToHex(text: string, caseMode: Case, prefix: Prefix, sep: Separator): string {
  const sepChar = sep === "space" ? " " : sep === "comma" ? ", " : sep === "colon" ? ":" : "";
  return text
    .split("")
    .map((ch) => {
      const hex = ch.charCodeAt(0).toString(16).padStart(2, "0");
      const formatted = caseMode === "upper" ? hex.toUpperCase() : hex;
      return prefix === "none" ? formatted : prefix + formatted;
    })
    .join(sepChar);
}

function hexToText(raw: string): string {
  // Strip known prefixes and separators, extract hex pairs
  const cleaned = raw
    .replace(/0x/gi, " ")
    .replace(/\\x/gi, " ")
    .replace(/%/g, " ")
    .replace(/[,:\s]+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((h) => {
      const code = parseInt(h, 16);
      return isNaN(code) ? "" : String.fromCharCode(code);
    })
    .join("");
}

const CASE_OPTIONS: { value: Case; label: string }[] = [
  { value: "upper", label: "UPPER" },
  { value: "lower", label: "lower" },
];

const PREFIX_OPTIONS: { value: Prefix; label: string }[] = [
  { value: "none", label: "None" },
  { value: "0x", label: "0x" },
  { value: "\\x", label: "\\x" },
  { value: "%", label: "% (URL)" },
];

const SEP_OPTIONS: { value: Separator; label: string }[] = [
  { value: "space", label: "Space" },
  { value: "comma", label: "Comma" },
  { value: "colon", label: "Colon" },
  { value: "none", label: "None" },
];

export default function TextToHexTool() {
  const [text, setText] = useState("");
  const [caseMode, setCaseMode] = useState<Case>("upper");
  const [prefix, setPrefix] = useState<Prefix>("none");
  const [sep, setSep] = useState<Separator>("space");

  const output = text ? textToHex(text, caseMode, prefix, sep) : "";

  const handleOutputChange = (val: string) => {
    setText(hexToText(val));
  };


  const byteCount = text.length;

  return (
    <Container cols={2}>
      <Panel>
        <Textarea
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          handlePaste={setText}
          placeholder="Enter text to convert to hexadecimal..."
        />
        <Container cols={3}>
          <Select
            label="Case"
            value={caseMode}
            onValueChange={v => setCaseMode(v as Case)}
          >
            <SelectTrigger>
              {CASE_OPTIONS.find(o => o.value === caseMode)?.label}
            </SelectTrigger>
            <SelectContent>
              {CASE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            label="Prefix"
            value={prefix}
            onValueChange={v => setPrefix(v as Prefix)}
          >
            <SelectTrigger>
              {PREFIX_OPTIONS.find(o => o.value === prefix)?.label}
            </SelectTrigger>
            <SelectContent>
              {PREFIX_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
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
              {SEP_OPTIONS.find(o => o.value === sep)?.label}
            </SelectTrigger>
            <SelectContent>
              {SEP_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Container>
      </Panel>
      <Panel>
        <Textarea
          label="Hexadecimal"
          value={output}
          onChange={(e) => handleOutputChange(e.target.value)}
          handlePaste={handleOutputChange}
          placeholder="Enter hexadecimal to convert to text..."
          rows={10}
          helperText={`${byteCount} byte${byteCount !== 1 ? "s" : ""}`}
        />
      </Panel>
    </Container>
  );
}