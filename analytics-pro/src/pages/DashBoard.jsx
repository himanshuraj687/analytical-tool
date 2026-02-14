import React, { useState, useEffect, useRef } from "react";
import SummaryCard from "../components/Data/SummaryCard";
import FileUpload from "../components/Data/FileUpload";
import DataTable from "../components/Data/DataTable";
import BarChartcomp from "../components/charts/BarChartcomp";
import LineChartcomp from "../components/charts/LineChartcomp";
import { gsap } from "gsap";
import { MdDownload, MdBarChart, MdShowChart, MdTableChart } from "react-icons/md";

const Dashboard = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleUpload = (cleaned, summaryData) => {
    setUploadedData(cleaned);
    setSummary(summaryData);

    if (cleaned.length > 0) {
      const col = Object.keys(cleaned[0])[0];
      const map = {};
      cleaned.forEach((row) => {
        const key = row[col] || "Unknown";
        map[key] = (map[key] || 0) + 1;
      });
      const formatted = Object.keys(map).map((k) => ({ label: k, value: map[k] }));
      setChartData(formatted);
    }
  };

  const downloadCSV = (data) => {
    if (!data || data.length === 0) return alert("No data available");
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  return (
      <div ref={pageRef}>
        {/* Header */}
        <div className="dash-section mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview of your data analysis activities
          </p>
        </div>

        {/* Upload */}
        <div className="dash-section mb-6">
          <FileUpload onData={handleUpload} />
        </div>

        {/* Summary Cards */}
        <div className="dash-section grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Total Data" value={summary?.rows || 0} index={0} />
          <SummaryCard title="Processed" value={summary?.rows || 0} index={1} />
          <SummaryCard title="Pending" value="0" index={2} />
          <SummaryCard title="Total Rows" value={summary?.rows || 0} index={3} />
        </div>

        {/* Charts */}
        <div className="dash-section grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <MdBarChart className="text-indigo-500" size={20} />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Upload Activity</h3>
            </div>
            <BarChartcomp data={chartData} />
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <MdShowChart className="text-emerald-500" size={20} />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Processing Trend</h3>
            </div>
            <LineChartcomp data={chartData} />
          </div>
        </div>

        {/* Data Table */}
        <div className="dash-section bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdTableChart className="text-cyan-500" size={20} />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Uploaded Data</h3>
            </div>
            <button
              onClick={() => downloadCSV(uploadedData)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <MdDownload size={16} />
              Download CSV
            </button>
          </div>
          <DataTable data={uploadedData} />
        </div>
      </div>
  );
};

export default Dashboard;
