import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import StatBox from "@/components/ui/StatBox";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: "0 sec",
      speakingTime: "0 sec",
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text.split(/\n/).length;

  // Reading: ~200 WPM, Speaking: ~130 WPM
  const readingMinutes = words / 200;
  const speakingMinutes = words / 130;

  const formatTime = (minutes: number) => {
    if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime: formatTime(readingMinutes),
    speakingTime: formatTime(speakingMinutes),
  };
}

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <Container>
      <Panel>
        <Textarea
          label="Input Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          handlePaste={setText}
          placeholder="Paste or type your text here..."
        />
      </Panel>

      <Container cols={4} mobileCols={2}>
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Characters" value={stats.characters} />
        <StatBox label="Characters (no spaces)" value={stats.charactersNoSpaces} />
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
        <StatBox label="Lines" value={stats.lines} />
        <StatBox label="Reading Time" value={stats.readingTime} />
        <StatBox label="Speaking Time" value={stats.speakingTime} />
      </Container>
    </Container>
  );
}
