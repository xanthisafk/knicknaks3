import { useEffect, useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import "@tiptap/extension-color";
import "@tiptap/extension-font-family";
import "@tiptap/extension-highlight";
import "@tiptap/extension-text-align";
import "@tiptap/extension-text-style";
import "@tiptap/extension-underline";
import "@tiptap/starter-kit";
import { CircleSmall, ListOrdered, Redo, TextAlignCenter, TextAlignEnd, TextAlignStart, Undo } from "lucide-react";
import { Divider } from "@/components/layout";
import { ToolbarButton } from "./ToolbarButton";
import { ColorPickerButton } from "../ColorPickerButton";
import { GOOGLE_FONTS } from "./types";

export function EditorToolbar({
    editor,
    activeFont,
    onFontChange,
}: {
    editor: Editor | null;
    activeFont: string;
    onFontChange: (font: string) => void;
}) {
    const [textColor, setTextColor] = useState("#1a1a1a");
    const [highlightColor, setHighlightColor] = useState("#fef08a");
    const [fontOpen, setFontOpen] = useState(false);
    const fontRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
                setFontOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const applyTextColor = (color: string) => {
        setTextColor(color);
        editor?.chain().focus().setColor(color).run();
    };

    const applyHighlight = (color: string) => {
        setHighlightColor(color);
        editor?.chain().focus().toggleHighlight({ color }).run();
    };

    const noEditor = !editor;

    return (
        <div
            className="flex items-center gap-1 flex-wrap"
            style={{ minHeight: 38 }}
        >
            {/* Font family dropdown */}
            <div ref={fontRef} className="relative">
                <button
                    type="button"
                    disabled={noEditor}
                    onClick={() => setFontOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2 h-[30px] rounded border text-sm transition-all duration-150"
                    style={{
                        fontFamily: activeFont,
                        fontSize: 12,
                        color: "var(--text-primary)",
                        background: fontOpen ? "var(--surface-secondary)" : "transparent",
                        border: "1px solid var(--border-default)",
                        cursor: noEditor ? "not-allowed" : "pointer",
                        opacity: noEditor ? 0.4 : 1,
                        minWidth: 130,
                        maxWidth: 160,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {activeFont}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-tertiary)" }}>▼</span>
                </button>
                {fontOpen && (
                    <div
                        className="absolute top-full left-0 mt-1 rounded-lg overflow-auto z-50 shadow-lg"
                        style={{
                            width: 200,
                            maxHeight: 280,
                            background: "var(--surface-elevated)",
                            border: "1px solid var(--border-default)",
                        }}
                    >
                        {GOOGLE_FONTS.map((font) => (
                            <button
                                key={font}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm transition-colors duration-100"
                                style={{
                                    fontFamily: font,
                                    color: font === activeFont ? "var(--color-primary-700)" : "var(--text-primary)",
                                    background:
                                        font === activeFont
                                            ? "var(--color-primary-50)"
                                            : "transparent",
                                    fontSize: 13,
                                }}
                                onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.background =
                                    "var(--surface-secondary)")
                                }
                                onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.background =
                                    font === activeFont
                                        ? "var(--color-primary-50)"
                                        : "transparent")
                                }
                                onClick={() => {
                                    onFontChange(font);
                                    setFontOpen(false);
                                }}
                            >
                                {font}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Divider />

            {/* Bold */}
            <ToolbarButton
                title="Bold (Ctrl+B)"
                active={editor?.isActive("bold")}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={noEditor}
            >
                <strong>B</strong>
            </ToolbarButton>

            {/* Italic */}
            <ToolbarButton
                title="Italic (Ctrl+I)"
                active={editor?.isActive("italic")}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={noEditor}
            >
                <em>I</em>
            </ToolbarButton>

            {/* Underline */}
            <ToolbarButton
                title="Underline (Ctrl+U)"
                active={editor?.isActive("underline")}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                disabled={noEditor}
            >
                <span style={{ textDecoration: "underline" }}>U</span>
            </ToolbarButton>

            {/* Strikethrough */}
            <ToolbarButton
                title="Strikethrough"
                active={editor?.isActive("strike")}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                disabled={noEditor}
            >
                <span style={{ textDecoration: "line-through" }}>S</span>
            </ToolbarButton>

            <Divider />

            {/* Text color */}
            <ColorPickerButton
                title="Text Color"
                value={textColor}
                onChange={applyTextColor}
                icon="A"
                underlineColor={textColor}
            />

            {/* Highlight */}
            <ColorPickerButton
                title="Highlight Color"
                value={highlightColor}
                onChange={applyHighlight}
                icon="▌"
                underlineColor={highlightColor}
            />

            <Divider />

            {/* Align left */}
            <ToolbarButton
                title="Align Left"
                active={editor?.isActive({ textAlign: "left" })}
                onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                disabled={noEditor}
            >
                <TextAlignStart />
            </ToolbarButton>

            {/* Align center */}
            <ToolbarButton
                title="Align Center"
                active={editor?.isActive({ textAlign: "center" })}
                onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                disabled={noEditor}
            >
                <TextAlignCenter />
            </ToolbarButton>

            {/* Align right */}
            <ToolbarButton
                title="Align Right"
                active={editor?.isActive({ textAlign: "right" })}
                onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                disabled={noEditor}
            >
                <TextAlignEnd />
            </ToolbarButton>

            <Divider />

            {/* Bullet list */}
            <ToolbarButton
                title="Bullet List"
                active={editor?.isActive("bulletList")}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={noEditor}
            >
                <CircleSmall />
            </ToolbarButton>

            {/* Ordered list */}
            <ToolbarButton
                title="Numbered List"
                active={editor?.isActive("orderedList")}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                disabled={noEditor}
            >
                <ListOrdered />
            </ToolbarButton>

            <Divider />

            {/* Undo */}
            <ToolbarButton
                title="Undo (Ctrl+Z)"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={noEditor || !editor?.can().undo()}
            >
                <Undo />
            </ToolbarButton>

            {/* Redo */}
            <ToolbarButton
                title="Redo (Ctrl+Y)"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={noEditor || !editor?.can().redo()}
            >
                <Redo />
            </ToolbarButton>

            {/* Hint when no editor focused */}
            {noEditor && (
                <span
                    className="ml-2 text-xs italic"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    Click on a page to start editing
                </span>
            )}
        </div>
    );
}