import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarChartcomp({ data }) {
  if (!data) return <p>No data available</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />

          {/* ANIMATION ENABLED HERE */}
          <Bar
            dataKey="value"
            fill="#4F46E5"
            animationBegin={200}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
