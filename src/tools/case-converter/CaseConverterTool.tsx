import { useState } from "react";
import { Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Radio, RadioGroup } from "@/components/ui/radio";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

const CASE_OPTIONS: { id: CaseType; label: string; example: string }[] = [
  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", label: "lowercase", example: "hello world" },
  { id: "title", label: "Title Case", example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world" },
  { id: "camel", label: "camelCase", example: "helloWorld" },
  { id: "pascal", label: "PascalCase", example: "HelloWorld" },
  { id: "snake", label: "snake_case", example: "hello_world" },
  { id: "kebab", label: "kebab-case", example: "hello-world" },
  { id: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { id: "dot", label: "dot.case", example: "hello.world" },
];

function tokenize(text: string): string[] {
  // Split on spaces, underscores, hyphens, dots, camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-\.]+/)
    .filter(Boolean);
}

function convertCase(text: string, caseType: CaseType): string {
  if (!text.trim()) return "";

  switch (caseType) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^|[.!?]\s+)\S/g, (c) => c.toUpperCase());
    case "camel": {
      const words = tokenize(text);
      return words
        .map((w, i) =>
          i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    }
    case "pascal": {
      const words = tokenize(text);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    }
    case "snake":
      return tokenize(text)
        .map((w) => w.toLowerCase())
        .join("_");
    case "kebab":
      return tokenize(text)
        .map((w) => w.toLowerCase())
        .join("-");
    case "constant":
      return tokenize(text)
        .map((w) => w.toUpperCase())
        .join("_");
    case "dot":
      return tokenize(text)
        .map((w) => w.toLowerCase())
        .join(".");
    default:
      return text;
  }
}

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("upper");

  const handleConvert = (caseType: CaseType) => {
    setActiveCase(caseType);
    setOutput(convertCase(input, caseType));
  };

  return (
    <div className="space-y-2">
      <Panel>
        <Textarea
          label="Input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (activeCase) setOutput(convertCase(e.target.value, activeCase));
          }}
          placeholder="Type or paste your text here..."
        />
      </Panel>

      <Panel>
        <Label>Case style</Label>

        <RadioGroup orientation="horizontal" value={activeCase} onValueChange={v => setActiveCase(v as CaseType)}>
          {CASE_OPTIONS.map((opt) => (
            <Radio key={opt.id} value={opt.id}
              label={opt.label}
              onClick={() => handleConvert(opt.id)}
            />
          ))}
        </RadioGroup>


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
    </div>
  );
}
