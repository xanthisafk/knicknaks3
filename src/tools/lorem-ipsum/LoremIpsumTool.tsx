import { useState } from "react";
import { Button, Input, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { toTitleCase } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci",
];

const FIRST_SENTENCE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateSentence(): string {
  const len = randomInt(6, 14);
  return generateWords(len);
}

function generateSentences(count: number, startWithLorem: boolean): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      sentences.push(FIRST_SENTENCE);
    } else {
      sentences.push(generateSentence());
    }
  }
  return sentences.join(" ");
}

function generateParagraphs(count: number, startWithLorem: boolean): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = randomInt(4, 8);
    paragraphs.push(generateSentences(sentenceCount, i === 0 && startWithLorem));
  }
  return paragraphs.join("\n\n");
}

type Mode = "paragraphs" | "sentences" | "words";

export default function LoremIpsumTool() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    let result = "";
    switch (mode) {
      case "paragraphs":
        result = generateParagraphs(count, startWithLorem);
        break;
      case "sentences":
        result = generateSentences(count, startWithLorem);
        break;
      case "words":
        result = generateWords(count);
        break;
    }
    setOutput(result);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Panel className="flex-1 flex flex-col gap-3">

        <Select label="Mode" value={mode} onValueChange={(value) => setMode(value as Mode)}>
          <SelectTrigger>{toTitleCase(mode)}</SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraphs">Paragraphs</SelectItem>
            <SelectItem value="sentences">Sentences</SelectItem>
            <SelectItem value="words">Words</SelectItem>
          </SelectContent>
        </Select>

        <Input
          label="Count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
        />

        <Toggle
          label='Start with "Lorem ipsum"'
          checked={startWithLorem}
          onChange={setStartWithLorem}
        />

        <Button onClick={generate}>Generate</Button>

      </Panel>

      {!output ?
        (
          <Panel className="flex-2 flex flex-col items-center justify-center gap-6">
            <span className="font-emoji text-6xl">📜</span>
            <h3 className="text-(--text-tertiary)">Output will show up here</h3>
          </Panel>
        )
        : (
          <Panel className="flex-2">
            <Textarea
              label="Generated Text"
              value={output}
              placeholder="Output will show up here"
              readOnly
            />
          </Panel>
        )}
    </div>
  );
}
