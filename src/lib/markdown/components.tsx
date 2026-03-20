import { renderToStaticMarkup } from "react-dom/server";
import { CodeBlock } from "@/components/advanced/CodeBlock";
import { CopyButton } from "@/components/ui/CopyButton";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
} from "@/components/ui/table";
import type { BundledTheme } from "shiki";

interface CodeOptions {
    code: string;
    lang: string;
    lightTheme?: BundledTheme;
    darkTheme?: BundledTheme;
    forPrint: boolean;
}

export function renderCodeBlock({ code, lang, lightTheme, darkTheme, forPrint }: CodeOptions): string {
    // For print, render a plain Shiki block via CodeBlock with no copy UI
    return renderToStaticMarkup(
        <div className="md-codeblock" >
            <CodeBlock
                code={code}
                langHint={lang}
                lightTheme={lightTheme ?? "github-light"}
                darkTheme={darkTheme ?? "github-dark"}
                label={lang || undefined}
            />
        </div>
    );
}

// marked passes pre-rendered HTML strings for header cells and rows
// We parse those back into cell text to feed into our Table components
export function renderTable(headerHtml: string, bodyHtml: string): string {
    // Extract cell contents from the raw HTML marked gives us
    const headerCells = extractCells(headerHtml, "th");
    const bodyRows = extractRows(bodyHtml);

    return renderToStaticMarkup(
        <div className="md-table-wrapper" >
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            headerCells.map((cell, i) => (
                                <TableHead key={i} dangerouslySetInnerHTML={{ __html: cell }} />
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        bodyRows.map((cells, ri) => (
                            <TableRow key={ri} >
                                {
                                    cells.map((cell, ci) => (
                                        <TableCell key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
                                    ))
                                }
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ── Helpers to parse marked's raw HTML output ──────────────────────────────

function extractCells(html: string, tag: "th" | "td"): string[] {
    const re = new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, "gsi");
    return [...html.matchAll(re)].map((m) => m[1].trim());
}

function extractRows(html: string): string[][] {
    const rowRe = /<tr[^>]*>(.*?)<\/tr>/gsi;
    return [...html.matchAll(rowRe)].map((m) => extractCells(m[1], "td"));
}