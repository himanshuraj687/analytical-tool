import React from "react";

export default function DataTable({ data }) {
  if (!data || !data.length)
    return (
      <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
        No data available
      </div>
    );

  const cols = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50">
            {cols.map((c) => (
              <th
                key={c}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((r, i) => (
            <tr
              key={i}
              className="hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors duration-150"
            >
              {cols.map((c) => (
                <td
                  key={c}
                  className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
