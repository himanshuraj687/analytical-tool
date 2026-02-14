import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#F97316", "#14B8A6", "#F43F5E", "#8B5CF6"];

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

export default function DonutChartcomp({ data }) {
  if (!data) return <p className="text-slate-400 text-sm text-center py-8">No data available</p>;

  return (
    <div className="w-full h-75">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" animationDuration={1500} stroke="none">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
