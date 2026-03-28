import { useState } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";

// Full Unicode flip map — a-z, A-Z, 0-9, and common punctuation
const FLIP_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
  A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H",
  I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ",
  Q: "Q", R: "ᴚ", S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X",
  Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ",
  "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "'": ",", "!": "¡", "?": "¿", "&": "⅋",
  "_": "‾", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  "<": ">", ">": "<", "/": "\\", "\\": "/",
};

function flipText(input: string): string {
  return input
    .split("")
    .map((ch) => FLIP_MAP[ch] ?? ch)
    .reverse()
    .join("");
}

export default function UpsideDownTextTool() {
  const [input, setInput] = useState("");

  const flipped = flipText(input.trim());


  return (
    <div className="space-y-4">
      <Container cols={2}>
        <Panel>
          <Textarea
            label="Your Text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            handlePaste={setInput}
            onClear={() => setInput("")}
            placeholder="Type something here..."
          />
        </Panel>
        <Panel>
          <Textarea
            label="Flipped Text"
            value={flipped}
            disabled
            placeholder="˙˙˙ǝɹǝɥ ɹɐǝddɐ llᴉʍ ʇxǝʇ pǝddᴉlℲ"
          />
        </Panel>
      </Container>
    </div>
  );
}