import { useState } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const SEPARATORS = [
  { value: "-", label: "Hyphen" },
  { value: "_", label: "Underscore" },
  { value: ".", label: "Dot" },
];

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, separator) // Replace spaces
    .replace(new RegExp(`[${separator}]+`, "g"), separator) // Collapse separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), ""); // Trim separators
}

export default function TextToSlugTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");

  const slug = toSlug(input, separator);

  return (
    <Container>
      <Panel>
        <Container cols={3}>
          <Box colSpan={2}>
            <Input
              label="Input Text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              handlePaste={setInput}
              placeholder="My Blog Post Title! (2024)"
            />
          </Box>
          <Select
            label="Separator"
            value={separator}
            onValueChange={v => setSeparator(v)}
          >
            <SelectTrigger>
              {SEPARATORS.find(s => s.value === separator)?.label}
            </SelectTrigger>
            <SelectContent>
              {SEPARATORS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Container>
      </Panel>

      {slug && (
        <Panel>
          <Input
            label="Generated Slug"
            value={slug}
            disabled
            allowCopy={true}
            helperText={`Preview: example.com/blog/${slug}`}
          />
        </Panel>
      )
      }
    </Container >
  );
}
