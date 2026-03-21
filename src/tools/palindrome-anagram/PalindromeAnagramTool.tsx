import { useState } from "react";
import { Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import StatBox from "@/components/ui/StatBox";

function cleanText(text: string): string {
  // Remove non-alphanumeric characters and convert to lower case
  return text.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function checkPalindrome(cleanStr: string): boolean {
  if (cleanStr.length === 0) return false;
  let left = 0;
  let right = cleanStr.length - 1;
  while (left < right) {
    if (cleanStr[left] !== cleanStr[right]) return false;
    left++;
    right--;
  }
  return true;
}

function checkAnagram(cleanStr1: string, cleanStr2: string): boolean {
  if (cleanStr1.length === 0 || cleanStr2.length === 0) return false;
  if (cleanStr1.length !== cleanStr2.length) return false;

  const charCount: Record<string, number> = {};
  for (const char of cleanStr1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  for (const char of cleanStr2) {
    if (!charCount[char]) return false;
    charCount[char]--;
  }
  return true;
}

export default function PalindromeAnagramTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const clean1 = cleanText(text1);
  const clean2 = cleanText(text2);

  const isText1Palindrome = checkPalindrome(clean1);
  const isAnagram = checkAnagram(clean1, clean2);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Panel>
          <Textarea
            label="Phrase 1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="e.g. A man, a plan, a canal: Panama"
            className="min-h-[100px]"
          />
        </Panel>
        <Panel>
          <Textarea
            label="Phrase 2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="e.g. Panama canal plan, a man, a"
            className="min-h-[100px]"
          />
        </Panel>
        <StatBox label="Palindrome" textSize="6xl" value={isText1Palindrome ? "YES" : "NO"} />
        <StatBox label="Anagram" textSize="6xl" value={isAnagram ? "YES" : "NO"} />
      </div>
    </div>
  );
}
