import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import type { PageAnnotation } from "./types";
import { loadGoogleFont } from "@/lib/pdfHelper";

import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";

export interface PageEditorProps {
    pageData: { dataUrl: string; width: number; height: number };
    pageIndex: number;
    annotation: PageAnnotation | undefined;
    onAnnotationChange: (pageIndex: number, html: string) => void;
    activeFont: string;
}

export function PageEditor({
    pageData,
    pageIndex,
    annotation,
    onAnnotationChange,
    activeFont,
}: PageEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Underline,
            FontFamily,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: annotation?.html ?? "<p></p>",
        onUpdate: ({ editor }) => {
            onAnnotationChange(pageIndex, editor.getHTML());
        },
    });

    // Apply active font to the editor
    useEffect(() => {
        if (!editor) return;
        loadGoogleFont(activeFont);
        // Apply to selection or set as default for new content
        editor.chain().focus().setFontFamily(activeFont).run();
    }, [activeFont, editor]);

    return (
        <div
            className="relative mx-auto shadow-lg rounded-md overflow-hidden"
            style={{ width: pageData.width, maxWidth: "100%" }}
        >
            {/* PDF page rendered as background image */}
            <img
                src={pageData.dataUrl}
                alt={`Page ${pageIndex + 1}`}
                style={{ width: "100%", display: "block", userSelect: "none" }}
                draggable={false}
            />

            {/* Tiptap editor overlaid on top — transparent background so PDF shows through */}
            <div
                className="absolute inset-0"
                style={{ zIndex: 2 }}
            >
                <EditorContent
                    editor={editor}
                    style={{
                        width: "100%",
                        height: "100%",
                        cursor: "text",
                    }}
                    className="pdf-editor-layer"
                />
            </div>

            {/* Page number badge */}
            <div
                className="absolute bottom-2 right-3 text-xs px-2 py-0.5 rounded-full font-medium pointer-events-none"
                style={{
                    background: "var(--surface-elevated)",
                    color: "var(--text-tertiary)",
                    border: "1px solid var(--border-default)",
                    zIndex: 3,
                }}
            >
                {pageIndex + 1}
            </div>
        </div>
    );
}