import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from "shiki";
import { Loader2 } from "lucide-react";
import { CopyButton, Label } from "../ui";
import { cn } from "@/lib";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CodeBlockProps {
    code: string;
    langHint?: string;
    lightTheme?: BundledTheme;
    darkTheme?: BundledTheme;
    wrapLines?: boolean;
    label?: string;
    maxHeight?: string;
    className?: string;
    style?: CSSProperties;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_LANG = "text" as BundledLanguage;

const LANG_ALIASES: Record<string, BundledLanguage> = {
    js: "javascript", ts: "typescript",
    py: "python", rb: "ruby",
    sh: "bash", ps1: "powershell",
    "c++": "cpp", "c#": "csharp",
    gql: "graphql", md: "markdown",
    docker: "dockerfile", txt: FALLBACK_LANG, plaintext: FALLBACK_LANG,
};

// Keep the list small — Shiki lazy-loads langs not in this array, but
// pre-bundling the common ones avoids a dynamic import on first render.
const BUNDLED_LANGS: BundledLanguage[] = [
    "javascript", "typescript", "jsx", "tsx", "python", "rust", "go",
    "java", "css", "html", "json", "yaml", "bash", "sql", "markdown",
    "dockerfile", "diff", FALLBACK_LANG,
];

// ─── Highlighter singleton ────────────────────────────────────────────────────

let highlighterPromise: Promise<Highlighter> | null = null;
let highlighterInstance: Highlighter | null = null;

function getHighlighter(light: BundledTheme, dark: BundledTheme): Promise<Highlighter> {
    if (highlighterInstance) return Promise.resolve(highlighterInstance);
    if (highlighterPromise) return highlighterPromise;

    highlighterPromise = createHighlighter({
        themes: [light, dark],
        langs: BUNDLED_LANGS,
    }).then((h) => {
        highlighterInstance = h;
        return h;
    });

    return highlighterPromise;
}

// ─── Language resolution ──────────────────────────────────────────────────────

function resolveLang(hint: string | undefined): BundledLanguage {
    if (!hint) return FALLBACK_LANG;
    const lower = hint.toLowerCase().trim();
    if (LANG_ALIASES[lower]) return LANG_ALIASES[lower];
    if ((BUNDLED_LANGS as string[]).includes(lower)) return lower as BundledLanguage;
    return FALLBACK_LANG;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    langHint,
    lightTheme = "github-light",
    darkTheme = "github-dark",
    wrapLines = false,
    label,
    maxHeight,
    className = "",
}) => {
    const [html, setHtml] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const cancelled = useRef(false);

    const lang = useMemo(() => resolveLang(langHint), [langHint]);

    useEffect(() => {
        cancelled.current = false;
        setLoading(true);

        getHighlighter(lightTheme, darkTheme).then(async (h) => {
            // Dynamically load the language if it wasn't pre-bundled
            if (lang !== FALLBACK_LANG && !BUNDLED_LANGS.includes(lang)) {
                await h.loadLanguage(lang).catch(() => {/* ignore unknown lang */ });
            }
            const parsedTheme = document.documentElement.dataset.theme === "dark" ? darkTheme : lightTheme;

            if (cancelled.current) return;

            let rendered: string;
            try {
                rendered = h.codeToHtml(code, {
                    lang,
                    theme: parsedTheme,
                });
            } catch {
                rendered = h.codeToHtml(code, { lang: FALLBACK_LANG, theme: parsedTheme });
            }

            if (!cancelled.current) {
                setHtml(rendered);
                setLoading(false);
            }
        });

        return () => { cancelled.current = true; };
    }, [code, lang, lightTheme, darkTheme]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className={cn(
                "knicknaks-codeblock",
                className,
                "relative font-mono text-sm shadow-sm overflow-hidden rounded-lg",
                maxHeight && `max-h-[${maxHeight}]`,
            )}
            data-lang={lang}
        >
            {loading ? (
                <div
                    className="flex justify-center items-center p-1.5"
                >
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <>
                    <div className={cn(
                        "w-full flex flex-row items-center p-1.5",
                        label ? "justify-between" : "justify-end"
                    )}>
                        {label && <Label className="flex-1">{label}</Label>}
                        <CopyButton text={code} />
                    </div>
                    <div
                        className={cn(
                            wrapLines ? "overflow-x-hidden" : "overflow-x-auto",
                        )}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </>
            )}
        </div>
    );
};

export default CodeBlock;