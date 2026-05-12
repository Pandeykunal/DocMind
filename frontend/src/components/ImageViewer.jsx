import { useState } from "react";

const ImageViewer = ({ images }) => {
  const [expanded, setExpanded] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "12px",
      }}>
        {images.map((imgBase64, index) => (
          <div key={index} style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            overflow: "hidden",
          }}>
            {/* Image label */}
            <div style={{
              padding: "6px 12px",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              fontSize: "10px",
              color: "#7a7890",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🖼️</span> Image {index + 1}
              </span>
              <button
                onClick={() => setExpanded(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7a7890",
                  cursor: "pointer",
                  fontSize: "10px",
                  padding: 0,
                }}
              >
                Expand ↗
              </button>
            </div>

            {/* Image */}
            <div style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              background: "rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}
              onClick={() => setExpanded(index)}
            >
              <img
                src={`data:image/png;base64,${imgBase64}`}
                alt={`Retrieved image ${index + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {expanded !== null && (
        <div
          onClick={() => setExpanded(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={`data:image/png;base64,${images[expanded]}`}
              alt={`Image ${expanded + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "10px",
                border: "0.5px solid rgba(255,255,255,0.1)",
              }}
            />
            <button
              onClick={() => setExpanded(null)}
              style={{
                position: "absolute",
                top: "-12px",
                right: "-12px",
                background: "rgba(255,255,255,0.1)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "28px", height: "28px",
                color: "#e8e6f0",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
            <div style={{
              textAlign: "center",
              marginTop: "8px",
              fontSize: "11px",
              color: "#7a7890",
            }}>
              Image {expanded + 1} — click anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;