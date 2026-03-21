import { useState } from "react";
import { Textarea, Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

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

  const clearInputs = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Phrase 1 (Palindrome Check base)</label>
            <Textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="e.g. A man, a plan, a canal: Panama"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Phrase 2 (Target for Anagram Check)</label>
            <Textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="e.g. Panama canal plan, a man, a"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={clearInputs}>Clear Fields</Button>
          </div>
        </div>
      </Panel>

      {(clean1.length > 0 || clean2.length > 0) && (
        <Panel>
          <h3 className="text-[10px] font-semibold tracking-widest text-(--text-tertiary) uppercase mb-4">Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Palindrome Result */}
            <div className={`rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors border ${clean1.length === 0
              ? "bg-(--surface-secondary) border-(--border-default)"
              : isText1Palindrome
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
              <div className="text-sm text-(--text-secondary) mb-2 font-medium">Phrase 1 is a Palindrome</div>
              {clean1.length === 0 ? (
                <span className="text-xl font-bold text-(--text-tertiary)">Awaiting Input</span>
              ) : isText1Palindrome ? (
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">Yes!</span>
              ) : (
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">No</span>
              )}
            </div>

            {/* Anagram Result */}
            <div className={`rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors border ${clean1.length === 0 || clean2.length === 0
              ? "bg-(--surface-secondary) border-(--border-default)"
              : isAnagram
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
              <div className="text-sm text-(--text-secondary) mb-2 font-medium">Phrases are Anagrams</div>
              {clean1.length === 0 || clean2.length === 0 ? (
                <span className="text-xl font-bold text-(--text-tertiary)">Awaiting Both Inputs</span>
              ) : isAnagram ? (
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">Yes!</span>
              ) : (
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">No</span>
              )}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
