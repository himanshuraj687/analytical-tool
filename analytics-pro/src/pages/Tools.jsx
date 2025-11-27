import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  toNumberArray,
  mean,
  median,
  mode,
  min,
  max,
  stddev
} from "../utils/analytics.js";

import BarChartcomp from "../components/charts/BarChartcomp";
import PieChartcomp from "../components/charts/PieChartcomp";
import "./Tools.css";


export default function Tools() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedCol, setSelectedCol] = useState("");
  const [stats, setStats] = useState({});

  useEffect(() => {
    // read from localStorage (set by FileUpload)
    try {
      const raw = localStorage.getItem("uploadedData");
      const s = localStorage.getItem("uploadedSummary");
      const parsed = raw ? JSON.parse(raw) : [];
      setData(parsed);
      setSummary(s ? JSON.parse(s) : null);
      setColumns(parsed.length ? Object.keys(parsed[0]) : []);
      if (parsed.length && !selectedCol) setSelectedCol(Object.keys(parsed[0])[0]);
    } catch (e) {
      console.warn("Tools: failed to read localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!data || !selectedCol) return;
    const arr = toNumberArray(data, selectedCol);

      // If column is text → show only count
            if (arr.length === 0) {
           setStats({
               type: "text",
              count: data.length,
                      });
                  return;
          }

    const computed = {
      mean: mean(arr),
      median: median(arr),
      mode: mode(arr),
      min: min(arr),
      max: max(arr),
      stddev: stddev(arr),
      count: arr.length
    };
    setStats(computed);
  }, [data, selectedCol]);

  // Prepare simple chart data (value frequency or top N)
  const chartData = React.useMemo(() => {
    if (!data || !selectedCol) return null;
    const map = {};
    data.forEach(r => {
      const k = r[selectedCol] || "Unknown";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).slice(0,12).map(k => ({ label: k, value: map[k] }));
  }, [data, selectedCol]);

  return (
    <DashboardLayout>
      <div style={{padding:16}}>
        <h3>Tools — Advanced Analytics</h3>
        <p className="text-muted">Use uploaded dataset for quick column analytics.</p>

        {!data || data.length === 0 ? (
          <div className="card-box" style={{padding:12}}>No uploaded data found. Upload a CSV from Dashboard first.</div>
        ) : (
          <>
            <div className="card-box" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <label className="form-label">Select Column</label>
                <select className="form-select" value={selectedCol} onChange={e => setSelectedCol(e.target.value)}>
                  {columns.map(c => <option value={c} key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{marginLeft: "auto"}}>
                <div className="text-muted">Rows</div>
                <div className="card-box">
                  <h5>Column Info</h5>
                   <p><strong>Name:</strong> {selectedCol}</p>
                     <p><strong>Type:</strong> {
                      Number(toNumberArray(data, selectedCol)[0]) ? "Numeric" : "Text"
                                 }</p>
                        <p><strong>Unique Values:</strong> {
                        [...new Set(data.map(i => i[selectedCol]))].length
                                }</p>
                </div>

                <h5>{summary?.rows ?? data.length}</h5>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 12 }}>
              <div className="card-box">
                <div className="text-muted">Count (numeric)</div>
                <h4>{stats.count ?? "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Mean</div>
                <h4>{stats.mean !== null ? stats.mean.toFixed(3) : "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Median</div>
                <h4>{stats.median !== null ? stats.median.toFixed(3) : "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Std Dev</div>
                <h4>{stats.stddev !== null ? stats.stddev.toFixed(3) : "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Min</div>
                <h4>{stats.min !== null ? stats.min : "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Max</div>
                <h4>{stats.max !== null ? stats.max : "-"}</h4>
              </div>
              <div className="card-box">
                <div className="text-muted">Mode</div>
                <h4>{stats.mode ? `${stats.mode.value} (${stats.mode.count})` : "-"}</h4>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 12, marginTop: 16 }}>
              <div className="card-box">
                <h5>Value distribution</h5>
                <BarChartcomp data={chartData} />
              </div>

              <div className="card-box">
                <h5>Top categories (pie)</h5>
                <PieChartcomp data={chartData} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
