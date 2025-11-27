import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import SummaryCard from "../components/Data/SummaryCard";
import FileUpload from "../components/Data/FileUpload";
import DataTable from "../components/Data/DataTable";

import BarChartcomp from "../components/charts/BarChartcomp";
import LineChartcomp from "../components/charts/LineChartcomp";

import "./Dashboard.css";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Handle upload from FileUpload.jsx
  const handleUpload = (cleaned, summaryData) => {
    setUploadedData(cleaned);
    setSummary(summaryData);

    // Auto generate chart data (group by first column)
    if (cleaned.length > 0) {
      const col = Object.keys(cleaned[0])[0]; // first column
      const map = {};

      cleaned.forEach(row => {
        const key = row[col] || "Unknown";
        map[key] = (map[key] || 0) + 1;
      });

      const formatted = Object.keys(map).map((k) => ({
        label: k,
        value: map[k],
      }));

      setChartData(formatted);
    }
  };
  const downloadCSV = (data) => {
  if (!data || data.length === 0) return alert("No data available");

  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map(row => Object.values(row).join(","))
    .join("\n");

  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
};


  return (
    <DashboardLayout>
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

      {/* Page Title */}
      <h2 className="title">Dashboard</h2>
      <p className="subtitle">Overview of your data analysis activities</p>

      {/* File Upload Section */}
      <div className="upload-section">
        <FileUpload onData={handleUpload} />
      </div>

      {/* Summary Cards */}
      <div className="card-grid">
        <SummaryCard title="Total Data" value={summary?.rows || 0} />
        <SummaryCard title="Processed" value={summary?.rows || 0} />
        <SummaryCard title="Pending" value="0" />
        <SummaryCard title="Total Rows" value={summary?.rows || 0} />
      </div>

      {/* Charts Section */}
      <div className="chart-grid">

        <div className="chart-box">
          <h3>Upload Activity</h3>
          <BarChartcomp data={chartData} />
        </div>

        <div className="chart-box">
          <h3>Processing Trend</h3>
          <LineChartcomp data={chartData} />
        </div>

      </div>

      {/* Data Table Section */}
      <div className="table-section">
        <h3>Uploaded Data Table</h3>
        <DataTable data={uploadedData} />
      </div>
      <button
  className="btn btn-success"
  onClick={() => downloadCSV(uploadedData)}
>
  Download CSV Report
</button>

</motion.div>

    </DashboardLayout>
  );
};

export default Dashboard;
