import { useState } from "react";
import PDFUpload from "./components/PDFUpload";
import ChatInterface from "./components/ChatInterface";

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = {
        role: "ai",
        text: "This is a mock AI response. Connect to your FastAPI backend to get real answers from your PDF.",
        sources: [
          { label: "Page 3", type: "page" },
          { label: "Table 1", type: "table" },
          { label: "Image 2", type: "image" },
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClearChat = () => setMessages([]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0f0f13",
      color: "#e8e6f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>
      {/* Topbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "56px",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/docmind-logo.png"
            alt="DocMind"
            style={{ width: "30px", height: "30px", borderRadius: "8px" }}
          />
          <div>
            {/* Title — switches to "thinking" when loading */}
            <div style={{
              fontSize: "14px", fontWeight: 600, letterSpacing: "-0.2px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              DocMind
              {isTyping && (
                <>
                  <span style={{ color: "#4a4860", fontWeight: 400 }}>·</span>
                  <span style={{ color: "#7a7890", fontWeight: 400, fontSize: "13px" }}>
                    thinking
                  </span>
                  <span style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: "4px", height: "4px", borderRadius: "50%",
                        background: "#7a7890",
                        display: "inline-block",
                        animation: "thdot 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }} />
                    ))}
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#7a7890", marginTop: "-1px" }}>
              Chat with your PDF — text, tables & images
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "4px 12px",
          borderRadius: "20px",
          background: pdfFile ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
          border: `0.5px solid ${pdfFile ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
          fontSize: "12px",
          color: pdfFile ? "#4ade80" : "#7a7890",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: pdfFile ? "#4ade80" : "#4a4860",
          }} />
          {pdfFile ? pdfFile.name : "No PDF loaded"}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <PDFUpload
          pdfFile={pdfFile}
          setPdfFile={setPdfFile}
          onSendMessage={handleSendMessage}
        />
        <ChatInterface
          messages={messages}
          isTyping={isTyping}
          pdfFile={pdfFile}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onTypingChange={setIsTyping}
        />
      </div>

      <style>{`
        @keyframes thdot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;