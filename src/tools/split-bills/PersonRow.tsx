import { Button, Input, Label } from "@/components/ui";
import { Trash2 } from "lucide-react";
import { fmt } from "./helpers";

export interface Person {
    id: number;
    name: string;
    share: number; // percentage 0–100
}

export function PersonRow({
    person,
    index,
    grandTotal,
    sym,
    onChange,
    onRemove,
    canRemove,
}: {
    person: Person;
    index: number;
    grandTotal: number;
    sym: string;
    onChange: (id: number, field: "name" | "share", val: string) => void;
    onRemove: (id: number) => void;
    canRemove: boolean;
}) {
    const owes = grandTotal * (person.share / 100);

    return (
        <div className="flex items-center gap-3">
            <Input
                value={person.name}
                placeholder={`Person ${index + 1}`}
                onChange={(e) => onChange(person.id, "name", e.target.value)}
                className="flex-1 min-w-0"
            />
            <Input
                type="number"
                value={person.share}
                min={0}
                max={100}
                step={1}
                onChange={(e) => onChange(person.id, "share", e.target.value)}
                trailingText="%"
                className="w-24 shrink-0"
            />
            <Label size="l" variant="default" className="w-20 shrink-0 text-right tabular-nums">
                {sym}{fmt(owes)}
            </Label>
            {canRemove ? (
                <Button
                    onClick={() => onRemove(person.id)}
                    icon={Trash2}
                    variant="ghost"
                    size="xs"
                    className="shrink-0"
                />
            ) : (
                <div className="w-7 shrink-0" />
            )}
        </div>
    );
}