import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ScatterChartcomp({ data }) {
  if (!data) return <p>No data available</p>;

  // convert to scatter format
  const formatted = data.map((d, i) => ({
    x: i + 1,
    y: d.value,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis dataKey="y" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            data={formatted}
            fill="#EC4899"
            animationDuration={1500}
            animationBegin={200}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
