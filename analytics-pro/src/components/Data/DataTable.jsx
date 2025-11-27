import React from "react";
export default function DataTable({data}) {
  if (!data||!data.length) return <div>No data</div>;
  const cols = Object.keys(data[0]);
  return (
    <table border="1" cellPadding="6" style={{width:"100%", background:"#fff"}}>
      <thead><tr>{cols.map(c=> <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {data.map((r,i)=> <tr key={i}>{cols.map(c=> <td key={c}>{r[c]}</td>)}</tr>)}
      </tbody>
    </table>
  );
}
