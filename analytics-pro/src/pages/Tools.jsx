import React, { useEffect, useState, useRef } from "react";
import { toNumberArray, mean, median, mode, min, max, stddev } from "../utils/analytics.js";
import BarChartcomp from "../components/charts/BarChartcomp";
import PieChartcomp from "../components/charts/PieChartcomp";
import { gsap } from "gsap";
import { MdBuild, MdBarChart, MdPieChart, MdInfo } from "react-icons/md";

const StatCard = ({ label, value, delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      gsap.from(ref.current, { y: 20, opacity: 0, duration: 0.4, delay, ease: "power2.out" });
    }
  }, [delay]);

  return (
    <div ref={ref} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  );
};

export default function Tools() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedCol, setSelectedCol] = useState("");
  const [stats, setStats] = useState({});
  const pageRef = useRef(null);

  useEffect(() => {
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
    const ctx = gsap.context(() => {
      gsap.from(".tools-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!data || !selectedCol) return;
    const arr = toNumberArray(data, selectedCol);

    if (arr.length === 0) {
      setStats({ type: "text", count: data.length });
      return;
    }

    setStats({
      mean: mean(arr),
      median: median(arr),
      mode: mode(arr),
      min: min(arr),
      max: max(arr),
      stddev: stddev(arr),
      count: arr.length,
    });
  }, [data, selectedCol]);

  const chartData = React.useMemo(() => {
    if (!data || !selectedCol) return null;
    const map = {};
    data.forEach((r) => {
      const k = r[selectedCol] || "Unknown";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).slice(0, 12).map((k) => ({ label: k, value: map[k] }));
  }, [data, selectedCol]);

  const isNumeric = data.length > 0 && selectedCol && toNumberArray(data, selectedCol).length > 0;
  const uniqueCount = data.length > 0 && selectedCol ? [...new Set(data.map((i) => i[selectedCol]))].length : 0;

  return (
      <div ref={pageRef}>
        {/* Header */}
        <div className="tools-anim mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <MdBuild className="text-indigo-500" /> Tools
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Advanced column analytics for your uploaded dataset
          </p>
        </div>

        {!data || data.length === 0 ? (
          <div className="tools-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <MdBuild className="text-slate-400" size={28} />
            </div>
            <p className="text-slate-500 dark:text-slate-400">No uploaded data found. Upload a CSV from the Dashboard first.</p>
          </div>
        ) : (
          <>
            {/* Column selector + info */}
            <div className="tools-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">
                    Select Column
                  </label>
                  <select
                    value={selectedCol}
                    onChange={(e) => setSelectedCol(e.target.value)}
                    className="w-full md:w-64 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  >
                    {columns.map((c) => (
                      <option value={c} key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                    <MdInfo className="text-indigo-500" size={16} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-800 dark:text-white">{isNumeric ? "Numeric" : "Text"}</strong> column
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-xs text-slate-400">Rows</span>
                    <span className="ml-2 text-sm font-semibold text-slate-800 dark:text-white">{summary?.rows ?? data.length}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-xs text-slate-400">Unique</span>
                    <span className="ml-2 text-sm font-semibold text-slate-800 dark:text-white">{uniqueCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics grid */}
            <div className="tools-anim grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
              <StatCard label="Count" value={stats.count ?? "-"} delay={0} />
              <StatCard label="Mean" value={stats.mean != null ? stats.mean.toFixed(3) : "-"} delay={0.05} />
              <StatCard label="Median" value={stats.median != null ? stats.median.toFixed(3) : "-"} delay={0.1} />
              <StatCard label="Std Dev" value={stats.stddev != null ? stats.stddev.toFixed(3) : "-"} delay={0.15} />
              <StatCard label="Min" value={stats.min != null ? stats.min : "-"} delay={0.2} />
              <StatCard label="Max" value={stats.max != null ? stats.max : "-"} delay={0.25} />
              <StatCard label="Mode" value={stats.mode ? `${stats.mode.value} (${stats.mode.count})` : "-"} delay={0.3} />
            </div>

            {/* Charts */}
            <div className="tools-anim grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MdBarChart className="text-indigo-500" size={20} />
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Value Distribution</h3>
                </div>
                <BarChartcomp data={chartData} />
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MdPieChart className="text-amber-500" size={20} />
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Top Categories</h3>
                </div>
                <PieChartcomp data={chartData} />
              </div>
            </div>
          </>
        )}
      </div>
  );
}
