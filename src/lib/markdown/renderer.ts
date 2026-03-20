import { marked } from "marked";
import type { Highlighter } from "shiki";
import type { BundledTheme } from "shiki";
import { resolveLang } from "./highlighter";
import { renderCodeBlock, renderTable } from "./components";

interface RendererOptions {
    highlighter: Highlighter;
    lightTheme?: BundledTheme;
    darkTheme?: BundledTheme;
    forPrint: boolean;
}

export function buildRenderer({
    highlighter,
    lightTheme,
    darkTheme,
    forPrint,
}: RendererOptions) {
    const renderer = new marked.Renderer();

    renderer.code = ({ text, lang }) => {
        const resolvedLang = resolveLang(highlighter, lang);
        return renderCodeBlock({
            code: text,
            lang: resolvedLang,
            lightTheme,
            darkTheme,
            forPrint,
        });
    };

    renderer.table = ({ header, rows }) => {
        // marked v9+ passes token; render header row and body rows to HTML first
        const defaultRenderer = new marked.Renderer();
        const headerHtml = rows.length > 0
            ? defaultRenderer.tablerow({ text: header.map(h => defaultRenderer.tablecell(h)).join("") })
            : "";
        const bodyHtml = rows
            .map(row => defaultRenderer.tablerow({ text: row.map(cell => defaultRenderer.tablecell(cell)).join("") }))
            .join("");

        return renderTable(headerHtml, bodyHtml);
    };

    return renderer;
}