import { getSingletonHighlighter, type Highlighter } from "shiki";

export const SUPPORTED_LANGS = [
    "javascript", "typescript", "tsx", "jsx", "html", "css", "scss",
    "json", "yaml", "toml", "xml",
    "bash", "sh", "powershell",
    "python", "ruby", "php", "java", "kotlin", "swift", "go", "rust", "c", "cpp", "csharp",
    "sql", "graphql",
    "dockerfile", "nginx", "terraform",
    "markdown", "diff",
] as const;

let _promise: ReturnType<typeof getSingletonHighlighter> | null = null;

export function getHighlighter() {
    if (!_promise) {
        _promise = getSingletonHighlighter({
            themes: ["github-dark", "github-light"],
            langs: [...SUPPORTED_LANGS],
        });
    }
    return _promise;
}

export function resolveLang(highlighter: Highlighter, lang?: string): string {
    if (!lang) return "text";
    return highlighter.getLoadedLanguages().includes(lang) ? lang : "text";
}