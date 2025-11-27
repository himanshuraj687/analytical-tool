
import "./SummaryCard.css";
import React from "react";
export default function SummaryCards({summary}) {
  if (!summary) return null;
  return (
    <div style={{display:"flex", gap:12}}>
      <div style={{padding:12, background:"#fff", borderRadius:8}}>Rows: {summary.rows}</div>
      <div style={{padding:12, background:"#fff", borderRadius:8}}>Cols: {summary.columns}</div>
    </div>
  );
}
