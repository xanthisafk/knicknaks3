import { useRef, useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container, Box } from "@/components/layout/Primitive";
import { RotWheel, type RotWheelHandle } from "./RotWheel";
import { Download } from "lucide-react";

function rotN(text: string, shift: number): string {
  const n = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + n) % 26) + base);
  });
}

export default function RotCipherTool() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(13);
  const [output, setOutput] = useState("");
  const wheelRef = useRef<RotWheelHandle>(null);

  const handleInputChange = (text: string) => {
    setInput(text);
    setOutput(rotN(text, shift));
  };

  const handleShiftChange = (n: number) => {
    setShift(n);
    setOutput(rotN(input, n));
  };

  const downloadWheel = () => {
    wheelRef.current?.download();
  };


  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="Input"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            handlePaste={handleInputChange}
            onClear={() => handleInputChange("")}
            placeholder="Enter text to cipher..."
          />
          <Input
            label="Shift (N)"
            type="number"
            value={shift}
            onChange={(e) => {
              let n = parseInt(e.target.value);
              if (isNaN(n)) return;
              if (n < 1) n = 1;
              if (n > 9999) n = 9999;
              handleShiftChange(n);
            }}
            min={1}
            max={9999}
            step={1}
          />
        </Panel>
      </Box>
      <Box>
        <Panel>
          <Textarea
            label="Output"
            value={output}
            readOnly
            placeholder="Ciphered text will appear here..."
          />
        </Panel>
        <Panel>
          <div className="flex items-center justify-between">
            <Label>Reference</Label>
            <Button variant="ghost" icon={Download} onClick={() => downloadWheel()} />
          </div>
          <RotWheel shift={shift} ref={wheelRef} />
        </Panel>
      </Box>
    </Container>
  );
}
