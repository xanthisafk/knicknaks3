import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef } from "react";
import { loadGoogleFont } from "@/lib/pdfHelper";
import type { PageAnnotation } from "./types";

export interface PageEditorWithFocusProps {
    pageData: { dataUrl: string; width: number; height: number };
    pageIndex: number;
    annotations: PageAnnotation[];
    onAddAnnotation: (pageIndex: number, x: number, y: number) => void;
    onUpdateAnnotation: (id: string, html: string) => void;
    onDeleteAnnotation: (id: string) => void;
    activeFont: string;
    onEditorFocus: (editor: ReturnType<typeof useEditor>) => void;
}

function SingleEditor({
    annotation,
    activeFont,
    onUpdateAnnotation,
    onDeleteAnnotation,
    onEditorFocus
}: {
    annotation: PageAnnotation;
    activeFont: string;
    onUpdateAnnotation: (id: string, html: string) => void;
    onDeleteAnnotation: (id: string) => void;
    onEditorFocus: (editor: ReturnType<typeof useEditor>) => void;
}) {
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
        content: annotation.html,
        onUpdate: ({ editor }) => {
            onUpdateAnnotation(annotation.id, editor.getHTML());
        },
        onFocus: ({ editor }) => {
            onEditorFocus(editor);
        },
        onBlur: ({ editor }) => {
            // Delete if left totally empty
            if (editor.getText().trim() === "") {
                onDeleteAnnotation(annotation.id);
            }
        }
    });

    useEffect(() => {
        if (!editor) return;
        loadGoogleFont(activeFont);
        if (annotation.html === "<p></p>" || annotation.html === "") {
             editor.commands.focus();
        }
    }, [activeFont, editor]);

    return (
        <div 
            style={{ position: "absolute", left: `${annotation.x}%`, top: `${annotation.y}%`, minWidth: 150, zIndex: 10 }} 
            className="pdf-editor-layer"
        >
            <EditorContent 
                editor={editor} 
                className="bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-200 focus-within:border-primary-400 focus-within:bg-white transition-all rounded shadow-sm"
                style={{ cursor: 'text' }} 
            />
        </div>
    );
}

export function PageEditorWithFocus({
    pageData,
    pageIndex,
    annotations,
    onAddAnnotation,
    onUpdateAnnotation,
    onDeleteAnnotation,
    activeFont,
    onEditorFocus,
}: PageEditorWithFocusProps) {

    return (
        <div
            className="relative mx-auto shadow-lg rounded-md overflow-hidden"
            style={{ width: pageData.width, maxWidth: "100%", cursor: "crosshair" }}
            onPointerDown={(e) => {
                // Only trigger if clicking exactly on the wrapper or the image, not inside an editor
                if (e.target === e.currentTarget || (e.target as HTMLElement).tagName.toLowerCase() === "img") {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    onAddAnnotation(pageIndex, x, y);
                }
            }}
        >
            <img
                src={pageData.dataUrl}
                alt={`Page ${pageIndex + 1}`}
                style={{ width: "100%", display: "block", userSelect: "none" }}
                draggable={false}
            />
            {annotations.map(a => (
                <SingleEditor
                    key={a.id}
                    annotation={a}
                    activeFont={activeFont}
                    onUpdateAnnotation={onUpdateAnnotation}
                    onDeleteAnnotation={onDeleteAnnotation}
                    onEditorFocus={onEditorFocus}
                />
            ))}
            <div
                className="absolute bottom-2 right-3 text-xs px-2 py-0.5 rounded-full font-medium pointer-events-none select-none"
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