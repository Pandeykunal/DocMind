const TableRenderer = ({ tables }) => {
  if (!tables || tables.length === 0) return null;

  return (
    <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {tables.map((tableHtml, index) => (
        <div key={index} style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {/* Table header label */}
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
            gap: "6px",
          }}>
            <span>📊</span> Table {index + 1}
          </div>

          {/* Scrollable table wrapper */}
          <div style={{ overflowX: "auto", padding: "8px" }}>
            <style>{`
              .rag-table table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                color: #e8e6f0;
              }
              .rag-table th {
                background: rgba(124,106,247,0.15);
                color: #a78bfa;
                padding: 7px 12px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                border-bottom: 0.5px solid rgba(124,106,247,0.3);
                white-space: nowrap;
              }
              .rag-table td {
                padding: 6px 12px;
                border-bottom: 0.5px solid rgba(255,255,255,0.05);
                color: #c8c6d8;
                font-size: 12px;
              }
              .rag-table tr:nth-child(even) td {
                background: rgba(255,255,255,0.02);
              }
              .rag-table tr:last-child td {
                border-bottom: none;
              }
              .rag-table tr:hover td {
                background: rgba(124,106,247,0.05);
              }
            `}</style>
            <div
              className="rag-table"
              dangerouslySetInnerHTML={{ __html: tableHtml }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableRenderer;