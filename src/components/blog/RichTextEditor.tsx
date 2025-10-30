"use client";

import React, { useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  postId?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  postId,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // Image upload handler
  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      if (postId) {
        formData.append("postId", postId);
      }

      try {
        const toastId = toast.loading("Uploading image...");

        const response = await fetch("/api/blog/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image");
        }

        // Insert the uploaded image into the editor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.url);
          quill.setSelection(range.index + 1);
        }

        toast.success("Image uploaded successfully", { id: toastId });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      }
    };
  }, [postId]);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  // Quill formats
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .quill {
          background: white;
          border-radius: 8px;
        }

        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #e2e8f0;
        }

        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 1px solid #e2e8f0;
          border-top: none;
          font-size: 16px;
          min-height: 400px;
        }

        .rich-text-editor .ql-editor {
          min-height: 400px;
          font-family: inherit;
          color: #1e293b;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }

        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem auto;
        }

        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .rich-text-editor .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .rich-text-editor .ql-editor pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin-left: 0;
          color: #64748b;
        }

        .rich-text-editor .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
