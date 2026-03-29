import { useCallback, useEffect, useState } from "react";
import { Button, CopyButton, ExpectContent, Input, Label } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Tab, TabList, Tabs } from "@/components/ui/tab";
import { Cog } from "lucide-react";
import { ResultRow } from "@/components/advanced/ResultRow";

type UUIDVersion = "v4" | "v7";

const HEX: string[] = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, "0")
);

function bytesToUUIDString(bytes: Uint8Array): string {
  return (
    HEX[bytes[0]] + HEX[bytes[1]] + HEX[bytes[2]] + HEX[bytes[3]] + "-" +
    HEX[bytes[4]] + HEX[bytes[5]] + "-" +
    HEX[bytes[6]] + HEX[bytes[7]] + "-" +
    HEX[bytes[8]] + HEX[bytes[9]] + "-" +
    HEX[bytes[10]] + HEX[bytes[11]] + HEX[bytes[12]] +
    HEX[bytes[13]] + HEX[bytes[14]] + HEX[bytes[15]]
  );
}

function generateUUIDv4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  return bytesToUUIDString(bytes);
}

function generateUUIDv7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, BigInt(Date.now()), false);
  const extra = new Uint8Array(2);
  crypto.getRandomValues(extra);
  bytes[6] = extra[0];
  bytes[7] = extra[1];

  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  return bytesToUUIDString(bytes);
}

function generateUUID(version: UUIDVersion): string {
  return version === "v4" ? generateUUIDv4() : generateUUIDv7();
}

function clampCount(value: number): number {
  return Math.max(1, Math.min(100, value));
}

export default function UuidGeneratorTool() {
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [count, setCount] = useState(3);
  const [uuids, setUuids] = useState<string[]>([]);
  const [currVer, setCurrVer] = useState<UUIDVersion>("v4");

  useEffect(() => {
    generate();
  }, [])

  const generate = useCallback(() => {
    const safeCount = clampCount(count);
    const results: string[] = Array.from({ length: safeCount }, () =>
      generateUUID(version)
    );
    setUuids(results);
    setCurrVer(version);
  }, [version, count]);


  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Tabs
            label="Version"
            value={version}
            onValueChange={v => setVersion(v as UUIDVersion)}
          >
            <TabList>
              <Tab value="v4">v4</Tab>
              <Tab value="v7">v7</Tab>
            </TabList>
          </Tabs>
          <Input
            label="Count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          />
          <Button
            icon={Cog}
            onClick={generate}
            className="w-full"
          >
            Generate
          </Button>
        </Panel>
      </Box>
      <Box>
        <Panel>
          <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
            <Label>Results ({currVer})</Label>
            <CopyButton label="Copy All" text={uuids.join("\n")} />
          </div>
          <div className="space-y-3 max-h-120 overflow-y-auto">
            {uuids.length > 0 ? (
              uuids.map((uuid, i) => <ResultRow key={uuid} label={`${i + 1}.`} value={uuid} />)
            ) : <ExpectContent text="Generated UUIDs will show up here" emoji="🍃" />}
          </div>
        </Panel>
      </Box>
    </Container>

  );
}
