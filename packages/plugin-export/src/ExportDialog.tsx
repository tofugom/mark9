import React, { useState, useCallback } from "react";
import { FileDown, FileText, File, X } from "lucide-react";
import { exportToHtml } from "./export-html.js";
import { exportToPdf } from "./export-pdf.js";
import { exportToDocx } from "./export-docx.js";

export interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  fileName?: string;
}

type ExportFormat = "html" | "pdf" | "docx";

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportDialog({
  isOpen,
  onClose,
  markdown,
  fileName = "document",
}: ExportDialogProps): React.ReactElement | null {
  const [isExporting, setIsExporting] = useState(false);

  const baseName = fileName.replace(/\.md$/, "");

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsExporting(true);
      try {
        switch (format) {
          case "html": {
            const html = await exportToHtml(markdown, baseName);
            const blob = new Blob([html], { type: "text/html" });
            downloadBlob(blob, `${baseName}.html`);
            break;
          }
          case "pdf": {
            await exportToPdf(markdown, baseName);
            break;
          }
          case "docx": {
            const blob = await exportToDocx(markdown, baseName);
            downloadBlob(blob, `${baseName}.docx`);
            break;
          }
        }
        onClose();
      } catch (err) {
        console.error(`[export] Failed to export as ${format}:`, err);
      } finally {
        setIsExporting(false);
      }
    },
    [markdown, baseName, onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-[var(--bg-editor)] border border-[var(--border-primary)] rounded-lg shadow-2xl w-[400px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Export Document
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-[13px] text-[var(--text-secondary)] mb-4">
          Choose an export format for &ldquo;{baseName}&rdquo;
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport("html")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileText size={20} className="text-[#e44d26]" />
            <div className="text-left">
              <div className="text-[14px] font-medium text-[var(--text-primary)]">
                HTML
              </div>
              <div className="text-[12px] text-[var(--text-secondary)]">
                Standalone HTML with styling
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileDown size={20} className="text-[#f40f02]" />
            <div className="text-left">
              <div className="text-[14px] font-medium text-[var(--text-primary)]">
                PDF
              </div>
              <div className="text-[12px] text-[var(--text-secondary)]">
                Print to PDF via browser dialog
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleExport("docx")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <File size={20} className="text-[#2b579a]" />
            <div className="text-left">
              <div className="text-[14px] font-medium text-[var(--text-primary)]">
                DOCX
              </div>
              <div className="text-[12px] text-[var(--text-secondary)]">
                Microsoft Word document
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
