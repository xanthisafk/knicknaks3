import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from "shiki";
import { Loader2 } from "lucide-react";
import { CopyButton, Label } from "../ui";
import { cn } from "@/lib";
import { useTheme } from "@/hooks/useTheme";

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

    const { theme } = useTheme();
    const activeTheme = theme === "dark" ? darkTheme : lightTheme;

    const lang = useMemo(() => resolveLang(langHint), [langHint]);

    useEffect(() => {
        cancelled.current = false;
        setLoading(true);

        getHighlighter(lightTheme, darkTheme).then(async (h) => {
            if (lang !== FALLBACK_LANG && !BUNDLED_LANGS.includes(lang)) {
                await h.loadLanguage(lang).catch(() => {/* ignore unknown lang */ });
            }

            if (cancelled.current) return;

            let rendered: string;
            try {
                rendered = h.codeToHtml(code, { lang, theme: activeTheme });
            } catch {
                rendered = h.codeToHtml(code, { lang: FALLBACK_LANG, theme: activeTheme });
            }

            if (!cancelled.current) {
                setHtml(rendered);
                setLoading(false);
            }
        });

        return () => { cancelled.current = true; };
        // activeTheme is derived from `theme`, so it drives re-highlighting on toggle
    }, [code, lang, lightTheme, darkTheme, theme]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className={cn(
                "knicknaks-codeblock",
                className,
                "relative h-full w-full font-mono text-sm overflow-hidden rounded-lg",
                maxHeight && `max-h-[${maxHeight}]`,
            )}
            data-lang={lang}
        >
            {loading ? (
                <div className="flex justify-center items-center p-1.5">
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
                        className={cn(wrapLines ? "overflow-x-hidden" : "overflow-x-auto")}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </>
            )}
        </div>
    );
};

export default CodeBlock;