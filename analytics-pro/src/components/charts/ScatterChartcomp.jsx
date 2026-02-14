import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700">
        <p className="text-pink-300">X: {payload[0].value}, Y: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

export default function ScatterChartcomp({ data }) {
  if (!data) return <p className="text-slate-400 text-sm text-center py-8">No data available</p>;

  const formatted = data.map((d, i) => ({ x: i + 1, y: d.value }));

  return (
    <div className="w-full h-75">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="x" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="y" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={formatted} fill="#EC4899" animationDuration={1500} animationBegin={200} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
