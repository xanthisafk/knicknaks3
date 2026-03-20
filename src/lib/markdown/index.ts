import { marked } from "marked";
import type { BundledTheme } from "shiki";
import { getHighlighter } from "./highlighter";
import { buildRenderer } from "./renderer";

export interface RenderMarkdownOptions {
    lightTheme?: BundledTheme;
    darkTheme?: BundledTheme;
    forPrint?: boolean;
}

export async function renderMarkdown(
    markdown: string,
    options: RenderMarkdownOptions = {}
): Promise<string> {
    const {
        lightTheme = "github-light",
        darkTheme = "github-dark",
        forPrint = false,
    } = options;

    const highlighter = await getHighlighter();
    const renderer = buildRenderer({ highlighter, lightTheme, darkTheme, forPrint });

    return marked.parse(markdown, { renderer, gfm: true, breaks: true }) as string;
}