import { Panel } from "@/components/layout";
import { CopyButton, Input, Label } from "@/components/ui";

interface PercentCardProps {
    label: string;
    formula: string;
    input1: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder: string;
        leadingText: string;
        trailingText: string;
    }
    input2: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder: string;
        leadingText: string;
        trailingText: string;
    }
    result: string;
}

export const PercentCard = ({
    label,
    formula,
    input1,
    input2,
    result,
}: PercentCardProps) => {
    return <Panel className="grid grid-cols-1 md:grid-cols-3 gap-3" >
        <div className="col-span-full flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <Label variant="default">{label}</Label>
                <Label size="xs">Formula: {formula}</Label>
            </div>
            {result && (<CopyButton text={result} />)}
        </div>
        <Input
            type="number"
            value={input1.value}
            onChange={input1.onChange}
            placeholder={input1.placeholder}
            leadingText={input1.leadingText}
            trailingText={input1.trailingText}
        />
        <Input
            type="number"
            value={input2.value}
            onChange={input2.onChange}
            placeholder={input2.placeholder}
            leadingText={input2.leadingText}
            trailingText={input2.trailingText}
        />
        <Input
            readOnly
            value={result}
            placeholder="Result"
            leadingText="="
        />
    </Panel>
}