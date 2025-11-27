import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ onData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please choose a CSV file");

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const cleaned = res.data.cleanedData || [];
      const summary = res.data.summary || {};

      // Save globally so Tools/Reports/Settings can read it
      try {
        localStorage.setItem("uploadedData", JSON.stringify(cleaned));
        localStorage.setItem("uploadedSummary", JSON.stringify(summary));
      } catch (e) {
        console.warn("localStorage save failed", e);
      }

      // callback to Dashboard so charts & table update immediately
      onData(cleaned, summary);

    } catch (err) {
      console.error(err);
      alert("Upload failed. Backend not connected.");
    }

    setLoading(false);
  };

  return (
    <div className="card-box">
      <h4>Upload CSV File</h4>

      <div className="d-flex gap-2">
        <input
          type="file"
          accept=".csv"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
