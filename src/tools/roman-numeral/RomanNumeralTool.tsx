import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { toRoman, fromRoman } from "@/lib/numberHelper";
import { Box, Container } from "@/components/layout/Primitive";
import { ResultRow } from "@/components/advanced/ResultRow";

export default function RomanNumeralTool() {
  const [numInput, setNumInput] = useState("");
  const [romInput, setRomInput] = useState("");

  const romanResult = useMemo(() => {
    const n = parseInt(numInput);
    if (!numInput || isNaN(n)) return null;
    return toRoman(n);
  }, [numInput]);

  const numResult = useMemo(() => {
    if (!romInput) return null;
    return fromRoman(romInput);
  }, [romInput]);

  return (

    <Container cols={2}>
      <Box>
        <Panel className="h-fit">
          <Input
            value={numInput}
            onChange={e => setNumInput(e.target.value)}
            handlePaste={setNumInput}
            onClear={() => setNumInput("")}
            type="number"
            label="Number (1-3999)"
            placeholder="e.g. 2024"
          />
          {romanResult && (
            <ResultRow label="Roman" value={romanResult} />
          )}
        </Panel>
      </Box>

      <Box>
        <Panel>
          <Input
            value={romInput}
            onChange={e => setRomInput(e.target.value)}
            handlePaste={setRomInput}
            onClear={() => setRomInput("")}
            label="Roman Numeral"
            placeholder="e.g. MMXXIV"
            className="font-mono uppercase"
          />
          {numResult && (
            <ResultRow label="Number" value={numResult.toString()} />
          )}
        </Panel>
      </Box>
    </Container>
  );
}
