import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LineChartcomp({ data }) {
  if (!data) return <p>No data available</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />

          {/* LINE DRAWING ANIMATION */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationBegin={0}
            animationDuration={1800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
