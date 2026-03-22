import { cn } from "@/lib";
import type { HTMLAttributes } from "react";

interface EmojiProps extends HTMLAttributes<HTMLSpanElement> {
    emoji?: string;
}

export function Emoji({ emoji, className, children, ...props }: EmojiProps) {
    return <span className={cn("font-emoji", className)} {...props}>{emoji}{children}</span>;
}