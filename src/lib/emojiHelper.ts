import emojiRegex from "emoji-regex";

const regex = emojiRegex();

/**
 * Check if string contains emoji
 */
export function stringHasEmoji(source: string): boolean {
  return regex.test(source);
}

/**
 * Get all emojis from a string
 */
export function getEmojis(source: string): string[] {
  return [...source.matchAll(regex)].map((m) => m[0]);
}

/**
 * Get first emoji in string
 */
export function getFirstEmoji(source: string): string | null {
  const match = source.match(regex);
  return match ? match[0] : null;
}

/**
 * Count emojis in string
 */
export function countEmojis(source: string): number {
  return getEmojis(source).length;
}

/**
 * Replace emojis with span wrapper
 */
export function wrapEmojisWithSpan(source: string): string {
  return source.replace(regex, (emoji) => {
    return `<span class="font-emoji">${emoji}</span>`;
  });
}

/**
 * Remove emojis from string
 */
export function removeEmojis(source: string): string {
  return source.replace(regex, "");
}

/**
 * Split string into emoji + text segments
 */
export function splitByEmoji(source: string): (string | { emoji: string })[] {
  const parts: (string | { emoji: string })[] = [];

  let lastIndex = 0;

  for (const match of source.matchAll(regex)) {
    const emoji = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(source.slice(lastIndex, index));
    }

    parts.push({ emoji });

    lastIndex = index + emoji.length;
  }

  if (lastIndex < source.length) {
    parts.push(source.slice(lastIndex));
  }

  return parts;
}