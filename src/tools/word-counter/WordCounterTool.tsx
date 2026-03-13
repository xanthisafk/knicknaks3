import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";

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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-md bg-(--surface-secondary) border border-(--border-default)">
      <span className="text-2xl md:text-3xl font-bold text-primary-500 tabular-nums">
        {value}
      </span>
      <span className="text-xs text-(--text-tertiary) mt-1 text-center">{label}</span>
    </div>
  );
}

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-2">
      <Panel>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="h-56 text-sm"
        />
      </Panel>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Characters (no spaces)" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Reading Time" value={stats.readingTime} />
        <StatCard label="Speaking Time" value={stats.speakingTime} />
      </div>
    </div>
  );
}
