import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";

const REGIONAL_MULTIPLIERS: Record<string, number> = {
  hundred: 1e2,
  thousand: 1e3,
  lakh: 1e5,
  lac: 1e5,
  million: 1e6,
  crore: 1e7,
  arab: 1e9,
  billion: 1e9,
  kharab: 1e11,
  trillion: 1e12,
  'lakh crore': 1e12,
  quadrillion: 1e15,
  quintillion: 1e18,
};

const WORD_TO_NUM: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

function wordsToNumber(input: string): string {
  const cleaned = input.trim().toLowerCase().replace(/[,\-]/g, " ").replace(/\s+/g, " ");

  // direct number
  if (/^[\d.]+$/.test(cleaned)) {
    return cleaned;
  }

  const tokens = cleaned.split(" ");
  let total = 0;
  let current = 0;
  let isNegative = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (token === "negative" || token === "minus") {
      isNegative = true;
      continue;
    }
    if (token === "and") continue;
    if (token === "point" || token === "decimal") {
      // decimel
      const decimalPart = tokens.slice(i + 1).map(t => WORD_TO_NUM[t] ?? "").join("");
      if (decimalPart) {
        total += current;
        return `${isNegative ? "-" : ""}${total}.${decimalPart}`;
      }
      break;
    }

    const twoWord = `${token} ${tokens[i + 1]}`;
    if (REGIONAL_MULTIPLIERS[twoWord]) {
      const mult = REGIONAL_MULTIPLIERS[twoWord];
      total += (current || 1) * mult;
      current = 0;
      i++;
      continue;
    }

    if (REGIONAL_MULTIPLIERS[token]) {
      const mult = REGIONAL_MULTIPLIERS[token];
      if (mult >= 1e6) {
        total += (current || 1) * mult;
        current = 0;
      } else {
        current *= mult;
      }
      continue;
    }

    if (WORD_TO_NUM[token] !== undefined) {
      current += WORD_TO_NUM[token];
      continue;
    }

    return "";
  }

  total += current;
  return `${isNegative ? "-" : ""}${total !== 0 ? total : ""}`;
}

export default function WordToNumberTool() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";

    return wordsToNumber(input);
  }, [input]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label={"Words"}
            value={input}
            onChange={e => setInput(e.target.value)}
            handlePaste={setInput}
            onClear={() => setInput("")}
            placeholder="Type a number in words..."
          />
        </Panel>
      </Box>
      <Box>
        <Panel>
          <Textarea
            label={"Number"}
            value={output}
            allowCopy={true}
            readOnly
            placeholder="Converted output will appear here"
          />
        </Panel>
      </Box>
    </Container>
  );
}