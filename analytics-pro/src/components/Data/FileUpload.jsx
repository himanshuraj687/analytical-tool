import React, { useState, useRef } from "react";
import axios from "axios";
import { MdCloudUpload, MdCheckCircle, MdInsertDriveFile } from "react-icons/md";
import { gsap } from "gsap";

export default function FileUpload({ onData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const uploadRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return alert("Please choose a CSV file");

    const fd = new FormData();
    fd.append("file", file);

    // Attach logged-in username so the dataset is saved under their account
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (stored.username) fd.append("username", stored.username);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const cleaned = res.data.cleanedData || [];
      const summary = res.data.summary || {};

      try {
        localStorage.setItem("uploadedData", JSON.stringify(cleaned));
        localStorage.setItem("uploadedSummary", JSON.stringify(summary));
      } catch (e) {
        console.warn("localStorage save failed", e);
      }

      onData(cleaned, summary);

      // Success animation
      if (uploadRef.current) {
        gsap.fromTo(uploadRef.current, { scale: 1 }, { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Backend not connected.");
    }

    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div ref={uploadRef} className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Upload CSV File</h4>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragOver
            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
            : file
              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10"
              : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        onClick={() => document.getElementById("csv-file-input").click()}
      >
        {file ? (
          <>
            <MdCheckCircle size={32} className="text-emerald-500" />
            <div className="flex items-center gap-2">
              <MdInsertDriveFile className="text-emerald-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{file.name}</span>
            </div>
          </>
        ) : (
          <>
            <MdCloudUpload size={36} className="text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="text-indigo-500 font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-slate-400">CSV files only</p>
          </>
        )}
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer
          ${loading || !file
            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            : "bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5"
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading...
          </span>
        ) : "Upload & Process"}
      </button>
    </div>
  );
}
