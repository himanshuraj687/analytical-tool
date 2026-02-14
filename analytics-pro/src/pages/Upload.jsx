import React, { useState, useEffect, useRef } from "react";
import FileUpload from "../components/Data/FileUpload";
import { gsap } from "gsap";
import { MdCheckCircle, MdTableView } from "react-icons/md";

export default function Upload() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".upload-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleUploaded = (cleaned, summaryData) => {
    setData(cleaned);
    setSummary(summaryData);
  };

  return (
      <div ref={pageRef}>
        {/* Header */}
        <div className="upload-anim mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Upload Dataset
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Upload CSV files to clean, process, and analyze
          </p>
        </div>

        {/* Upload component */}
        <div className="upload-anim mb-6">
          <FileUpload onData={handleUploaded} />
        </div>

        {/* Summary */}
        {summary && (
          <div className="upload-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MdCheckCircle className="text-emerald-500" size={20} />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Upload Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Rows</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{summary.rows}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Columns</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{summary.columns}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview table */}
        {data.length > 0 && (
          <div className="upload-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MdTableView className="text-cyan-500" size={20} />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Sample Rows</h3>
              <span className="ml-auto text-xs text-slate-400">Showing first 5 rows</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
  );
}
