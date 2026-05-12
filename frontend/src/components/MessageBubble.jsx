const sourceColors = {
  page: { bg: "rgba(124,106,247,0.12)", border: "rgba(124,106,247,0.3)", color: "#a78bfa" },
  table: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", color: "#4ade80" },
  image: { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.25)", color: "#fb923c" },
};

const TypingDots = () => (
  <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: "#7a7890",
        animation: "bounce 1.2s ease-in-out infinite",
        animationDelay: `${i * 0.2}s`,
      }} />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
    `}</style>
  </div>
);

const MessageBubble = ({ message, isTypingIndicator = false, isRTL = false }) => {
  const isUser = message.role === "user";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: "16px",
    }}>
      {/* Role label */}
      <div style={{
        fontSize: "10px",
        color: "#4a4860",
        marginBottom: "4px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}>
        {isUser ? "You" : "AI"}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: "75%",
        padding: "10px 14px",
        borderRadius: isUser ? "12px 12px 3px 12px" : "3px 12px 12px 12px",
        background: isUser
          ? "rgba(124,106,247,0.18)"
          : "rgba(255,255,255,0.05)",
        border: isUser
          ? "0.5px solid rgba(124,106,247,0.35)"
          : "0.5px solid rgba(255,255,255,0.08)",
        fontSize: "13px",
        lineHeight: 1.6,
        color: "#e8e6f0",
        direction: isRTL ? "rtl" : "ltr",
      }}>
        {isTypingIndicator ? <TypingDots /> : (
          <span style={{ whiteSpace: "pre-wrap" }}>{message.text}</span>
        )}
      </div>

      {/* Source chips */}
      {!isUser && !isTypingIndicator && message.sources?.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "6px",
        }}>
          {message.sources.map((src, i) => {
            const c = sourceColors[src.type] || sourceColors.page;
            return (
              <div key={i} style={{
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: 500,
                background: c.bg,
                border: `0.5px solid ${c.border}`,
                color: c.color,
              }}>
                {src.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Language tag */}
      {!isUser && message.language && message.language !== "English" && (
        <div style={{ fontSize: "10px", color: "#4a4860", marginTop: "4px" }}>
          🌐 {message.language}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;