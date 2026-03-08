import emojiRegex from 'emoji-regex';
const regex = emojiRegex();

export function stringHasEmoji(source: string): boolean {
    const values = source.matchAll(regex);
    return values.toArray().length > 0;
}