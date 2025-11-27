import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import FileUpload from "../components/Data/FileUpload";   // <-- IMPORTANT
import "./Upload.css";

export default function Upload() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  // Callback from FileUpload.jsx
  const handleUploaded = (cleaned, summaryData) => {
    setData(cleaned);
    setSummary(summaryData);
  };

  return (
    <DashboardLayout>
      <div className="upload-page">

        <h2 className="upload-title">Upload Your Dataset</h2>
        <p className="upload-subtitle">Upload CSV files to clean, process and analyze.</p>

        {/* This shows your working upload UI */}
        <FileUpload onData={handleUploaded} />

        {/* Show summary after upload */}
        {summary && (
          <div className="upload-summary-card">
            <h3>Upload Summary</h3>
            <p><strong>Total Rows:</strong> {summary.rows}</p>
            <p><strong>Total Columns:</strong> {summary.columns}</p>
          </div>
        )}

        {/* Show sample data */}
        {data.length > 0 && (
          <div className="upload-preview">
            <h3>Sample Rows</h3>
            <table className="upload-table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td key={j}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
