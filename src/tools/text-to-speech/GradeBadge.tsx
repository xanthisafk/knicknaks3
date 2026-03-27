import { Label } from "@/components/ui";
import { gradeColor } from "./lib";
import type { VoiceGrade } from "./types";

export interface GradeBadgeProps {
  grade: VoiceGrade;
  className?: string;
}

export function GradeBadge({ grade }: GradeBadgeProps) {
  const color = gradeColor(grade);
  return (
    <Label size="s" style={{ color }}>{grade}</Label>
  );
}