import { useState, useRef, useEffect } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";

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

function encodeToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(/\s+/) // Split by words safely
    .map(word =>
      word
        .split("")
        .map(char => MORSE_CODE_DICT[char] || char) // Leave unknown chars as is, or remove? I'll keep them
        .join(" ")
    )
    .join(" / ");
}

function decodeFromMorse(morse: string): string {
  return morse
    .split(/\s*\/\s*|\s{3,}/) // Split by ' / ' or 3+ spaces (words)
    .map(word =>
      word
        .split(" ")
        .map(code => REVERSE_MORSE_CODE_DICT[code] || code) // Unknown codes left alone
        .join("")
    )
    .join(" ");
}

export default function MorseCodeTool() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(20);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopPlayback = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const playMorse = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!morse.trim()) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    setIsPlaying(true);

    const dotDuration = 1.2 / wpm; // in seconds
    const freq = 600; // Hz
    let currentTime = ctx.currentTime + 0.1;

    // Clean up input for playing: extract dots, dashes, spaces
    const tokens = morse.split("");

    for (let i = 0; i < tokens.length; i++) {
       if (!isPlaying) break; // If user stopped
       
       const token = tokens[i];
       if (token === "." || token === "-") {
         const duration = (token === "." ? 1 : 3) * dotDuration;
         const osc = ctx.createOscillator();
         const gainNode = ctx.createGain();

         osc.type = "sine";
         osc.frequency.value = freq;
         
         // Smooth attack and release to avoid clicking
         gainNode.gain.setValueAtTime(0, currentTime);
         gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.005);
         gainNode.gain.setValueAtTime(1, currentTime + duration - 0.005);
         gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

         osc.connect(gainNode);
         gainNode.connect(ctx.destination);

         osc.start(currentTime);
         osc.stop(currentTime + duration);

         currentTime += duration + dotDuration; // Add intracharacter space
       } else if (token === " ") {
         // Check if it's multiple spaces or a slash
         // " " is 1 letter space (3 dots total, 1 + 2)
         currentTime += 2 * dotDuration;
       } else if (token === "/") {
         // Word space (7 dots total)
         currentTime += 6 * dotDuration;
       }
    }

    const totalDurationMs = (currentTime - ctx.currentTime) * 1000;
    const finalTimeout = window.setTimeout(() => {
        setIsPlaying(false);
    }, totalDurationMs);
    
    timeoutRefs.current.push(finalTimeout);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setMorse(encodeToMorse(val));
    stopPlayback(); // stop any current playback if edited
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    setText(decodeFromMorse(val));
    stopPlayback();
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Text Input</label>
            </div>
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter text to translate to Morse Code..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div className="w-full md:w-48">
                <Input
                  type="number"
                  label="Speed (WPM)"
                  value={wpm}
                  onChange={(e) => setWpm(Math.max(1, Math.min(100, parseInt(e.target.value) || 20)))}
                  min={1}
                  max={100}
                />
             </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2 mt-4 items-center">
                <label className="text-sm font-medium text-[var(--text-primary)]">Morse Code</label>
                 <Button
                  onClick={playMorse}
                  variant={isPlaying ? "secondary" : "primary"}
                  className="px-6 py-2"
                  disabled={!morse.trim()}
                >
                  {isPlaying ? (
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Stop
                    </span>
                  ) : (
                    "🔊 Play Audio"
                  )}
                </Button>
            </div>
            <Textarea
              value={morse}
              onChange={(e) => handleMorseChange(e.target.value)}
              placeholder="Enter morse code (e.g. .... . .-.. .-.. ---)"
              className="min-h-[120px] font-mono text-lg tracking-widest"
              dir="auto"
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Translator Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
           <li>Letters are separated by a space.</li>
           <li>Words are separated by a slash (<code>/</code>) or three spaces.</li>
           <li>Unrecognized characters are generally ignored in tone playback but passed through in text.</li>
           <li>Adjust the WPM setting to speed up or slow down playback.</li>
        </ul>
      </Panel>
    </div>
  );
}
