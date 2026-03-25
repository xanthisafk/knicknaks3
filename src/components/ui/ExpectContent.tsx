import { Label } from "./Label";

interface ExpectContentProps {
    text?: string;
    emoji?: string;
}

export function ExpectContent({ text, emoji = "🪀" }: ExpectContentProps) {
    return (
        <div className="w-full grid grid-cols-1 p-6 gap-12 justify-items-center">
            <span className="font-emoji text-6xl">{emoji}</span>
            <Label>{text}</Label>
        </div>
    )
}