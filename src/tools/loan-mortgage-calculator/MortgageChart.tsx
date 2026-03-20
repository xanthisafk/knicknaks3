import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface YearlyRow {
    year: number;
    totalPrincipal: number;
    totalInterest: number;
    totalPayment: number;
    balance: number;
}

interface Props {
    data: YearlyRow[];
    sym?: string;
}

function fmtAxis(n: number, sym: string) {
    return n >= 1000 ? sym + Math.round(n / 1000) + "k" : sym + Math.round(n);
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: NameType; value: ValueType; color: string }>;
    label?: string | number;
    sym?: string;
}

function CustomTooltip({ active, payload, label, sym = "$" }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-(--border-default) bg-(--surface-elevated) px-3 py-2 text-xs shadow-md">
            <p className="mb-1.5 font-semibold text-(--text-primary)">Year {label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-(--text-secondary)">
                    <span
                        className="mr-1.5 inline-block h-2 w-2 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}:{" "}
                    <span className="font-medium text-(--text-primary) tabular-nums">
                        {sym}{entry.value?.toLocaleString()}
                    </span>
                </p>
            ))}
        </div>
    );
}

export default function MortgageChart({ data, sym = "$" }: Props) {
    // Totals were already computed in the parent's single-pass buildSchedule.
    // We still need them for the stat row, so derive once and memo.
    const { totalInterest, totalPaid, principal } = useMemo(() => {
        let totalInterest = 0, totalPaid = 0, principal = 0;
        for (const row of data) {
            totalInterest += row.totalInterest;
            totalPaid += row.totalPayment;
            principal += row.totalPrincipal;
        }
        return { totalInterest, totalPaid, principal };
    }, [data]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5 text-xs">
                {[
                    { label: "Principal", value: sym + principal.toLocaleString() },
                    { label: "Total interest", value: sym + Math.round(totalInterest).toLocaleString(), accent: true },
                    { label: "Total paid", value: sym + Math.round(totalPaid).toLocaleString() },
                ].map(({ label, value, accent }) => (
                    <div key={label} className="rounded-lg bg-(--surface-secondary) px-3 py-2.5">
                        <p className="text-(--text-tertiary)">{label}</p>
                        <p className={`mt-0.5 text-base font-semibold tabular-nums ${accent ? "text-primary-500" : "text-(--text-primary)"}`}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 text-xs text-(--text-secondary)">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary-500" />
                    Principal
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary-200" />
                    Interest
                </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                        tickFormatter={(v) => fmtAxis(v, sym)}
                    />
                    <Tooltip content={<CustomTooltip sym={sym} />} cursor={{ fill: "var(--border-default)", opacity: 0.4 }} />
                    <Bar dataKey="totalPrincipal" name="Principal" stackId="a" fill="var(--color-primary-500)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="totalInterest" name="Interest" stackId="a" fill="var(--color-primary-200)" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}