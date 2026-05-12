import { useState, useRef, useEffect } from "react";
import { queryRAG } from "../api/client";
import MessageBubble from "./MessageBubble";
import TableRenderer from "./TableRenderer";
import ImageViewer from "./ImageViewer";

const ChatInterface = ({ messages, isTyping, pdfFile, onSendMessage, onClearChat, onTypingChange }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || !pdfFile) return;

    const text = input.trim();
    setInput("");
    setLoading(true);
    onTypingChange?.(true);

    const userMsg = { role: "user", text };
    setLocalMessages((prev) => [...prev, userMsg]);

    try {
      const response = await queryRAG(text);
      const { answer, tables, images, query_language, query_is_rtl } = response.data;

      const aiMsg = {
        role: "ai",
        text: answer,
        tables: tables || [],
        images: images || [],
        language: query_language,
        isRTL: query_is_rtl,
        sources: [],
      };

      setLocalMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setLocalMessages((prev) => [...prev, {
        role: "ai",
        text: "Something went wrong. Please try again.",
        tables: [], images: [], sources: [],
      }]);
    } finally {
      setLoading(false);
      onTypingChange?.(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setLocalMessages([]);
    onClearChat?.();
  };

  const allMessages = localMessages;

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#e8e6f0" }}>Chat</span>
          {pdfFile && (
            <span style={{
              fontSize: "10px", color: "#7a7890",
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "20px", padding: "2px 8px",
            }}>
              {pdfFile.name}
            </span>
          )}
        </div>
        {allMessages.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              background: "none",
              border: "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "#7a7890",
              fontSize: "11px",
              padding: "4px 10px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e8e6f0";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#7a7890";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}>
        {allMessages.length === 0 ? (
          <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "#4a4860",
          }}>
            <div style={{ fontSize: "40px", opacity: 0.5 }}>💬</div>
            <div style={{ fontSize: "14px", color: "#7a7890", fontWeight: 500 }}>
              No messages yet
            </div>
            <div style={{ fontSize: "12px", color: "#4a4860", textAlign: "center" }}>
              {pdfFile
                ? "Ask anything about your PDF in any language"
                : "Upload a PDF from the sidebar to get started"}
            </div>
          </div>
        ) : (
          <>
            {allMessages.map((msg, i) => (
              <div key={i}>
                <MessageBubble
                  message={msg}
                  isRTL={msg.isRTL || false}
                />
                {msg.role === "ai" && msg.tables?.length > 0 && (
                  <TableRenderer tables={msg.tables} />
                )}
                {msg.role === "ai" && msg.images?.length > 0 && (
                  <ImageViewer images={msg.images} />
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <MessageBubble
                message={{ role: "ai", text: "" }}
                isTypingIndicator={true}
              />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: "12px 16px",
        borderTop: "0.5px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "8px 8px 8px 14px",
        }}>
          <span style={{ fontSize: "16px", paddingBottom: "2px", opacity: 0.4 }}>📎</span>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              pdfFile
                ? "Ask in any language — English, Hindi, Arabic..."
                : "Upload a PDF first..."
            }
            disabled={!pdfFile || loading}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#e8e6f0",
              fontSize: "13px",
              resize: "none",
              lineHeight: 1.5,
              fontFamily: "inherit",
              maxHeight: "100px",
              overflowY: "auto",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!pdfFile || loading || !input.trim()}
            style={{
              width: "32px", height: "32px",
              borderRadius: "8px",
              background: (!pdfFile || loading || !input.trim())
                ? "rgba(124,106,247,0.2)"
                : "linear-gradient(135deg, #7c6af7, #a78bfa)",
              border: "none",
              cursor: (!pdfFile || loading || !input.trim()) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px",
              flexShrink: 0,
              transition: "opacity 0.15s",
              opacity: (!pdfFile || loading || !input.trim()) ? 0.4 : 1,
            }}
          >
            ➤
          </button>
        </div>
        {pdfFile && (
          <div style={{
            fontSize: "10px", color: "#4a4860",
            textAlign: "center", marginTop: "6px",
          }}>
            🌐 Multilingual supported — ask in any language
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;