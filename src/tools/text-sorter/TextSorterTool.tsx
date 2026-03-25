import { useState } from "react";
import { ExpectContent, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Container } from "@/components/layout/Primitive";

type SortMode = "alpha-asc" | "alpha-desc" | "length-asc" | "length-desc" | "numeric" | "random";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "alpha-asc", label: "A → Z" },
  { id: "alpha-desc", label: "Z → A" },
  { id: "length-asc", label: "Short → Long" },
  { id: "length-desc", label: "Long → Short" },
  { id: "numeric", label: "Numeric" },
  { id: "random", label: "Shuffle" },
];

function sortLines(text: string, mode: SortMode): string {
  const lines = text.split("\n");
  switch (mode) {
    case "alpha-asc":
      return lines.sort((a, b) => a.localeCompare(b)).join("\n");
    case "alpha-desc":
      return lines.sort((a, b) => b.localeCompare(a)).join("\n");
    case "length-asc":
      return lines.sort((a, b) => a.length - b.length).join("\n");
    case "length-desc":
      return lines.sort((a, b) => b.length - a.length).join("\n");
    case "numeric":
      return lines.sort((a, b) => {
        const na = parseFloat(a) || 0;
        const nb = parseFloat(b) || 0;
        return na - nb;
      }).join("\n");
    case "random":
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join("\n");
    default:
      return text;
  }
}

export default function TextSorterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("alpha-asc");

  const handleSort = (mode: SortMode) => {
    setSortMode(mode);
    setOutput(sortLines(input, mode));
  };

  const handleInput = (text: string) => {
    setInput(text);
    setOutput(sortLines(text, sortMode));
  }


  return (
    <Container cols={2}>
      <Panel>
        <Textarea
          label="Input Lines"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={"banana\napple\ncherry\ndate"}
          handlePaste={handleInput}
        />
        <Select
          label="Mode"
          value={sortMode}
          onValueChange={v => handleSort(v as SortMode)}
        >
          <SelectTrigger>
            {SORT_OPTIONS.find(opt => opt.id === sortMode)?.label}
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Panel>


      <Panel>
        {output ? (
          <Textarea
            label="Output"
            value={output}
            rows={11}
            readOnly
          />
        ) : <ExpectContent text="Results will show up here" emoji="🧙‍♀️" />}
      </Panel>

    </Container>
  );
}
