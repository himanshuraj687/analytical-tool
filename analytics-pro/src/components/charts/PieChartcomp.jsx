import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#06B6D4", "#EC4899"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700">
        <p className="font-medium">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill }}>Value: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function PieChartcomp({ data }) {
  if (!data) return <p className="text-slate-400 text-sm text-center py-8">No data available</p>;

  return (
    <div className="w-full h-75">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} animationBegin={100} animationDuration={1300} stroke="none">
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
