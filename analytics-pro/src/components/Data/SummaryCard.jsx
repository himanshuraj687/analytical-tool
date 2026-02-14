import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const colors = [
  { bg: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-500/20", icon: "bg-indigo-400/20 text-indigo-100" },
  { bg: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", icon: "bg-emerald-400/20 text-emerald-100" },
  { bg: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20", icon: "bg-amber-400/20 text-amber-100" },
  { bg: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/20", icon: "bg-cyan-400/20 text-cyan-100" },
];

export default function SummaryCard({ title, value, index = 0 }) {
  const cardRef = useRef(null);
  const color = colors[index % colors.length];

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out",
      });
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${color.bg} p-5 shadow-lg ${color.shadow} hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
    >
      <div className="relative z-10">
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      {/* Decorative circle */}
      <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full bg-white/10" />
    </div>
  );
}
