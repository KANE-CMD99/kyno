"use client";

import { useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { applyFormat, type FormatAction } from "./markdown-format";
import { readingMinutes } from "@/lib/blog-content";
// Without this the preview renders completely unstyled — only the blog post page
// pulls the stylesheet in otherwise. Next dedupes the import across entry points.
import "@/app/blog/markdown.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Image upload endpoint. Creators and admins post to different routes. */
  uploadUrl: string;
}

/** Icon-only buttons, so the accessible names live here rather than on the markup. */
const TOOLBAR: { action: FormatAction; label: string; ariaLabel: string }[] = [
  { action: "bold", label: "B", ariaLabel: "Bold" },
  { action: "italic", label: "I", ariaLabel: "Italic" },
  { action: "h2", label: "H2", ariaLabel: "Heading level 2" },
  { action: "h3", label: "H3", ariaLabel: "Heading level 3" },
  { action: "ul", label: "•", ariaLabel: "Bulleted list" },
  { action: "ol", label: "1.", ariaLabel: "Numbered list" },
  { action: "quote", label: '"', ariaLabel: "Blockquote" },
  { action: "link", label: "🔗", ariaLabel: "Insert link" },
  { action: "image", label: "🖼", ariaLabel: "Insert image" },
];

const UPLOAD_FAILED = "Image upload failed. Please try again.";

export default function MarkdownEditor({ value, onChange, uploadUrl }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputId = useId();
  const previewId = useId();

  function run(action: FormatAction, url = "") {
    const el = textareaRef.current;
    if (!el) return;

    const result = applyFormat(el.value, el.selectionStart, el.selectionEnd, action, url);
    onChange(result.value);

    // `applyFormat` parks the image caret *before* the markup it just inserted.
    // After an upload that reads backwards, so move it past the image. Every
    // other action keeps the selection it returned.
    const marker = `![](${url})`;
    const caretStart =
      action === "image" ? result.selectionStart + marker.length : result.selectionStart;
    const caretEnd = action === "image" ? caretStart : result.selectionEnd;

    // The caret can only be restored once React has committed the new value —
    // set it any earlier and the re-render snaps it back to the end.
    requestAnimationFrame(() => {
      const node = textareaRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(caretStart, caretEnd);
    });
  }

  async function upload(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "image");

      const res = await fetch(uploadUrl, { method: "POST", body });
      const data = await res.json().catch(() => ({} as { url?: string; error?: string }));
      if (!res.ok || !data.url) {
        setUploadError(data.error || UPLOAD_FAILED);
        return;
      }
      run("image", data.url);
    } catch {
      setUploadError(UPLOAD_FAILED);
    } finally {
      setUploading(false);
    }
  }

  function handleInsertLink() {
    const url = window.prompt("URL")?.trim();
    // Cancel or an empty answer inserts nothing at all.
    if (!url) return;
    run("link", url);
  }

  function handleDragOver(e: React.DragEvent<HTMLTextAreaElement>) {
    // Claim the drag only for files, otherwise the browser opens the dropped
    // file instead of firing `drop` — and text drags inside the editor keep
    // their native behaviour.
    if (e.dataTransfer.types.includes("Files")) e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    e.preventDefault();
    void upload(file);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
      <div
        className={`${
          previewOpen ? "hidden lg:flex" : "flex"
        } flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5`}
      >
        {TOOLBAR.map(({ action, label, ariaLabel }) => (
          <button
            key={action}
            type="button"
            aria-label={ariaLabel}
            onClick={() => {
              if (action === "image") fileInputRef.current?.click();
              else if (action === "link") handleInsertLink();
              else run(action);
            }}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900 ${
              action === "bold" ? "font-bold" : action === "italic" ? "italic" : ""
            }`}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 pl-2">
          {uploading && <span className="text-xs text-neutral-500">Uploading…</span>}
          <button
            type="button"
            aria-pressed={previewOpen}
            aria-controls={previewId}
            onClick={() => setPreviewOpen((open) => !open)}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 lg:hidden"
          >
            {previewOpen ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {uploadError && (
        <p role="alert" className="border-b border-red-100 bg-red-50 px-3 py-1.5 text-xs text-red-600">
          {uploadError}
        </p>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:divide-x lg:divide-neutral-200">
        <textarea
          id={inputId}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          // The id is generated here, so a caller's <label htmlFor> can't reach
          // this field — and a placeholder is not a durable accessible name.
          aria-label="Markdown source"
          placeholder="Write your post in Markdown…"
          className={`min-h-[280px] w-full resize-y px-3.5 py-3 font-mono text-base leading-relaxed outline-none ${
            previewOpen ? "hidden lg:block" : "block"
          }`}
        />

        <div
          id={previewId}
          className={`markdown-body min-h-[280px] overflow-x-auto px-3.5 py-3 text-sm ${
            previewOpen ? "block" : "hidden lg:block"
          }`}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <div className="text-neutral-400">Nothing to preview yet.</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-500">
        <span>About {readingMinutes(value)} min read</span>
        <span>Drag images into the body to upload them</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Clear it first, or picking the same file twice fires no change event.
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
