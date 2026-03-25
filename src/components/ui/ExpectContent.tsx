import { Label } from "./Label";

interface ExpectContentProps {
    text?: string;
    emoji?: string;
}

export function ExpectContent({ text = "Results will show up here", emoji = "🪀" }: ExpectContentProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-12">
            <span className="font-emoji text-6xl">{emoji}</span>
            <Label>{text}</Label>
        </div>
    )
}