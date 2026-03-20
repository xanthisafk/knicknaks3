import { useState, useRef, useEffect } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Pause, Play } from "lucide-react";

const MORSE_CODE_DICT: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  "\"": ".-..-.", "$": "...-..-", "@": ".--.-.",
};

const REVERSE_MORSE_CODE_DICT: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE_DICT).map(([k, v]) => [v, k])
);

// Unicode morse: · for dot, − for dash (proper minus)
function toUnicode(morse: string): string {
  return morse.replace(/\./g, "·").replace(/-/g, "−");
}

function encodeToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(word =>
      word
        .split("")
        .map(char => MORSE_CODE_DICT[char] || "")
        .filter(Boolean)
        .join(" ")
    )
    .join(" / ");
}

function decodeFromMorse(morse: string): string {
  // Normalize unicode dots/dashes back to ASCII before decoding
  const normalized = morse.replace(/·/g, ".").replace(/−/g, "-");
  return normalized
    .split(/\s*\/\s*|\s{3,}/)
    .map(word =>
      word
        .trim()
        .split(" ")
        .map(code => REVERSE_MORSE_CODE_DICT[code] || code)
        .join("")
    )
    .join(" ");
}

type MorseStyle = "ascii" | "unicode";

// Generate a WAV file buffer from morse code
function generateWavBuffer(morse: string, wpm: number): ArrayBuffer {
  const sampleRate = 44100;
  const dotDuration = 1.2 / wpm; // seconds
  const freq = 600;

  // Calculate total samples needed
  const tokens = morse.split("");
  let totalSamples = 0;
  for (const token of tokens) {
    if (token === "." || token === "-") {
      const dur = (token === "." ? 1 : 3) * dotDuration;
      totalSamples += Math.floor((dur + dotDuration) * sampleRate);
    } else if (token === " ") {
      totalSamples += Math.floor(2 * dotDuration * sampleRate);
    } else if (token === "/") {
      totalSamples += Math.floor(6 * dotDuration * sampleRate);
    }
  }
  totalSamples += Math.floor(sampleRate * 0.2); // small trailing silence

  const samples = new Float32Array(totalSamples);
  let pos = 0;

  for (const token of tokens) {
    if (token === "." || token === "-") {
      const dur = (token === "." ? 1 : 3) * dotDuration;
      const toneSamples = Math.floor(dur * sampleRate);
      const spaceSamples = Math.floor(dotDuration * sampleRate);
      const ramp = Math.min(Math.floor(0.005 * sampleRate), toneSamples);

      for (let i = 0; i < toneSamples; i++) {
        let env = 1;
        if (i < ramp) env = i / ramp;
        else if (i > toneSamples - ramp) env = (toneSamples - i) / ramp;
        samples[pos + i] = Math.sin(2 * Math.PI * freq * i / sampleRate) * env;
      }
      pos += toneSamples + spaceSamples;
    } else if (token === " ") {
      pos += Math.floor(2 * dotDuration * sampleRate);
    } else if (token === "/") {
      pos += Math.floor(6 * dotDuration * sampleRate);
    }
  }

  // Encode as 16-bit PCM WAV
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

export default function MorseCodeTool() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState(""); // always stored as ASCII internally
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(20);
  const [morseStyle, setMorseStyle] = useState<MorseStyle>("ascii");
  const [isDownloading, setIsDownloading] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const cancelRef = useRef(false);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    cancelRef.current = true;
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.suspend().catch(() => { });
    }
    setIsPlaying(false);
  };

  const playMorse = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    if (!morse.trim()) return;

    cancelRef.current = false;

    // Always create a fresh AudioContext for reliable playback
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      await audioCtxRef.current.close().catch(() => { });
    }
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;

    // Resume context (required after user gesture on some browsers)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    setIsPlaying(true);

    const dotDuration = 1.2 / wpm;
    const freq = 600;
    let currentTime = ctx.currentTime + 0.05;

    const tokens = morse.split("");

    for (const token of tokens) {
      if (cancelRef.current) break;

      if (token === "." || token === "-") {
        const duration = (token === "." ? 1 : 3) * dotDuration;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, currentTime + 0.005);
        gainNode.gain.setValueAtTime(0.8, currentTime + duration - 0.005);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(currentTime);
        osc.stop(currentTime + duration);

        currentTime += duration + dotDuration;
      } else if (token === " ") {
        currentTime += 2 * dotDuration;
      } else if (token === "/") {
        currentTime += 6 * dotDuration;
      }
    }

    const totalMs = (currentTime - ctx.currentTime) * 1000 + 100;
    const t = window.setTimeout(() => {
      if (!cancelRef.current) setIsPlaying(false);
    }, totalMs);
    timeoutRefs.current.push(t);
  };

  const downloadAudio = () => {
    if (!morse.trim()) return;
    setIsDownloading(true);
    try {
      const buffer = generateWavBuffer(morse, wpm);
      const blob = new Blob([buffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "morse-code.wav";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setMorse(encodeToMorse(val));
    if (isPlaying) stopPlayback();
  };

  const handleMorseChange = (val: string) => {
    // Normalize unicode input to ASCII for storage
    const normalized = val.replace(/·/g, ".").replace(/−/g, "-");
    setMorse(normalized);
    setText(decodeFromMorse(normalized));
    if (isPlaying) stopPlayback();
  };

  const displayMorse = morseStyle === "unicode" ? toUnicode(morse) : morse;

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex flex-col gap-2">
        <Panel>
          <Textarea
            label="Text input"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter text to translate to Morse Code..."
            rows={10}
            className="font-mono"
          />
        </Panel>


        <Panel className="flex flex-col gap-3">
          <Input
            type="number"
            label="Speed (WPM)"
            value={wpm}
            onChange={(e) =>
              setWpm(Math.max(1, Math.min(100, parseInt(e.target.value) || 20)))
            }
            min={1}
            max={100}
          />
          <Select
            label="Output Style"
            value={morseStyle}
            onValueChange={v => setMorseStyle(v as MorseStyle)}
          >
            <SelectTrigger>
              {morseStyle === "ascii" ? ". - (ASCII)" : "· − (Unicode)"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ascii">ASCII</SelectItem>
              <SelectItem value="unicode">Unicode</SelectItem>
            </SelectContent>
          </Select>
        </Panel>
      </div>

      {/* Output */}
      <div className="flex-1 flex flex-col gap-2">
        <Panel className="space-y-3">
          <Textarea
            label="Morse Code"
            value={displayMorse}
            onChange={(e) => handleMorseChange(e.target.value)}
            placeholder="Enter morse code (e.g. .... . .-.. .-.. ---)"
            className="font-mono"
            dir="auto"
            rows={10}
          />

          <div className="flex flex-row justify-between gap-2">
            <Button
              onClick={playMorse}
              variant={"primary"}
              disabled={!morse.trim()}
              icon={isPlaying ? Pause : Play}
            >
              {isPlaying ? "Stop" : "Play Audio"}
            </Button>
            <Button
              onClick={downloadAudio}
              variant="secondary"
              disabled={!morse.trim() || isDownloading}
              icon={Download}
            >
              {isDownloading ? "Generating..." : "Download WAV"}
            </Button>
          </div>

        </Panel>
      </div>

      {/* <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-4">
          Translator Tips
        </h3>
        <ul className="text-sm text-(--text-secondary) space-y-2 list-disc list-inside">
          <li>Letters are separated by a space.</li>
          <li>
            Words are separated by a slash (<code>/</code>) or three spaces.
          </li>
          <li>
            Switch between ASCII (<code>. -</code>) and Unicode (
            <code>· −</code>) display styles — both decode the same way.
          </li>
          <li>
            Use <strong>Download WAV</strong> to save the audio at your current
            WPM setting.
          </li>
          <li>Adjust the WPM setting to speed up or slow down playback.</li>
        </ul>
      </Panel> */}
    </div>
  );
}