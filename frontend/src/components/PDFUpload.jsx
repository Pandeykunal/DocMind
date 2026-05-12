import { useState, useRef } from "react";
import { uploadPDF } from "../api/client";

const SUGGESTIONS = [
  "Summarize this document",
  "List all tables found",
  "Describe images in PDF",
];

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PDFUpload = ({ pdfFile, setPdfFile, onSendMessage }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const response = await uploadPDF(file);
      const { chunks_count } = response.data;
      setPdfFile({
        name: file.name,
        size: formatSize(file.size),
        pages: 48,
        tables: chunks_count || 12,
        images: 7,
      });
    } catch (err) {
      setError("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const card = {
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
  };

  return (
    <div style={{
      width: "260px",
      flexShrink: 0,
      borderRight: "0.5px solid rgba(255,255,255,0.08)",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      overflowY: "auto",
    }}>
      <div style={{ fontSize: "11px", color: "#7a7890", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
        Document
      </div>

      {/* Upload zone */}
      {!pdfFile && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            ...card,
            border: dragging
              ? "1.5px dashed #7c6af7"
              : "1.5px dashed rgba(255,255,255,0.12)",
            background: dragging ? "rgba(124,106,247,0.08)" : "rgba(255,255,255,0.02)",
            borderRadius: "12px",
            padding: "28px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {uploading ? (
            <>
              <div style={{
                width: "32px", height: "32px",
                border: "3px solid rgba(124,106,247,0.2)",
                borderTop: "3px solid #7c6af7",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <div style={{ fontSize: "12px", color: "#7a7890" }}>Processing PDF...</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "28px" }}>☁️</div>
              <div style={{ fontSize: "12px", color: "#e8e6f0", fontWeight: 500, textAlign: "center" }}>
                Drop your PDF here
              </div>
              <div style={{ fontSize: "11px", color: "#7a7890" }}>or</div>
              <button style={{
                padding: "6px 14px",
                background: "rgba(124,106,247,0.15)",
                border: "0.5px solid rgba(124,106,247,0.4)",
                borderRadius: "6px",
                color: "#a78bfa",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 500,
              }}>
                Browse files
              </button>
            </>
          )}
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}

      {error && (
        <div style={{ fontSize: "11px", color: "#f87171", textAlign: "center" }}>{error}</div>
      )}

      {/* File card */}
      {pdfFile && (
        <>
          <div style={{ ...card, padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "rgba(239,68,68,0.15)",
                border: "0.5px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
              }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "12px", fontWeight: 500, color: "#e8e6f0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {pdfFile.name}
                </div>
                <div style={{ fontSize: "11px", color: "#7a7890" }}>{pdfFile.size}</div>
              </div>
              <button
                onClick={() => setPdfFile(null)}
                style={{
                  background: "none", border: "none", color: "#4a4860",
                  cursor: "pointer", fontSize: "14px", padding: "2px",
                  flexShrink: 0,
                }}
              >✕</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "6px" }}>
            {[
              { label: "Pages", value: pdfFile.pages, icon: "📑" },
              { label: "Tables", value: pdfFile.tables, icon: "📊" },
              { label: "Images", value: pdfFile.images, icon: "🖼️" },
            ].map((stat) => (
              <div key={stat.label} style={{
                ...card,
                flex: 1,
                padding: "8px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}>
                <div style={{ fontSize: "14px" }}>{stat.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e6f0" }}>{stat.value}</div>
                <div style={{ fontSize: "10px", color: "#7a7890" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Suggestions */}
      {pdfFile && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          <div style={{ fontSize: "11px", color: "#7a7890", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Try asking
          </div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSendMessage(s)}
              style={{
                background: "rgba(124,106,247,0.06)",
                border: "0.5px solid rgba(124,106,247,0.2)",
                borderRadius: "8px",
                padding: "8px 10px",
                color: "#a78bfa",
                fontSize: "12px",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.15s",
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,106,247,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(124,106,247,0.06)"}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PDFUpload;