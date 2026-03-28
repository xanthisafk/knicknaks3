import { useState } from "react";
import { Button, CopyButton, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Cog, TriangleAlert } from "lucide-react";
import { ResultRow } from "@/components/advanced/ResultRow";

// Crockford's Base32 alphabet
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateULID(): string {
  const now = Date.now();
  let timeStr = "";
  let t = now;
  for (let i = 9; i >= 0; i--) {
    timeStr = ENCODING[t % 32] + timeStr;
    t = Math.floor(t / 32);
  }
  let randStr = "";
  for (let i = 0; i < 16; i++) {
    randStr += ENCODING[Math.floor(Math.random() * 32)];
  }
  return timeStr + randStr;
}

function decodeULID(ulid: string): { timestamp: Date; random: string } | null {
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(ulid.toUpperCase())) return null;
  const u = ulid.toUpperCase();
  let ms = 0;
  for (let i = 0; i < 10; i++) {
    ms = ms * 32 + ENCODING.indexOf(u[i]);
  }
  return { timestamp: new Date(ms), random: u.slice(10) };
}

export default function UlidGeneratorTool() {
  const [ulids, setUlids] = useState<string[]>(() => [generateULID()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [inspect, setInspect] = useState("");

  const generate = () => {
    const newOnes = Array.from({ length: Math.min(count, 100) }, generateULID);
    setUlids(newOnes);
  };

  const decoded = inspect ? decodeULID(inspect) : null;

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Label variant="default">Generate</Label>
          <Input
            label="Count"
            type="number"
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            placeholder="Enter number of ULIDs to generate..."
          />
          <Button
            icon={Cog}
            className="w-full"
            onClick={generate}
          >
            Generate
          </Button>
          <div className="flex flex-row justify-between">
            <Label>Generated ULIDs</Label>
            <CopyButton label="Copy All" text={ulids.join("\n")} />
          </div>

          {ulids.map((ulid, index) => (
            <ResultRow key={ulid} label={`${index + 1}.`} value={ulid} />
          ))}
        </Panel>
      </Box>
      <Box>
        <Panel>
          <Label variant="default">Decode</Label>
          <Input
            label="ULID"
            value={inspect}
            handlePaste={setInspect}
            onChange={e => setInspect(e.target.value)}
            placeholder="Enter ULID to decode..."
          />
          {decoded ? (
            <div className="space-y-2">
              <ResultRow label="Timestamp" value={decoded.timestamp.toISOString()} />
              <ResultRow label="Random" value={decoded.random} />
            </div>
          ) : inspect ? (
            <Label variant="danger" icon={TriangleAlert}>Invalid ULID format</Label>
          ) : null}
        </Panel>
      </Box>
    </Container>

  );
}
