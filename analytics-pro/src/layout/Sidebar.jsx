import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdFileUpload, MdBuild, MdAssessment, MdSettings, MdInsights, MdClose, MdPerson } from "react-icons/md";
import { gsap } from "gsap";

const navItems = [
  { to: "/dashboard", icon: MdDashboard, label: "Dashboard" },
  { to: "/upload", icon: MdFileUpload, label: "Upload" },
  { to: "/tools", icon: MdBuild, label: "Tools" },
  { to: "/reports", icon: MdAssessment, label: "Reports" },
  { to: "/settings", icon: MdSettings, label: "Settings" },
  { to: "/profile", icon: MdPerson, label: "Profile" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  // Run entrance animation only once on first mount
  useEffect(() => {
    if (animated) return;
    const ctx = gsap.context(() => {
      gsap.from(".nav-link", {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        onComplete: () => setAnimated(true),
      });
    }, sidebarRef);
    return () => ctx.revert();
  }, [animated]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen w-65 z-50 flex flex-col
        bg-white dark:bg-slate-900 backdrop-blur-xl
        border-r border-slate-200/60 dark:border-slate-800
        transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <MdInsights size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
            Analytics Pro
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer">
          <MdClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline
                ${isActive
                  ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Icon size={20} className={isActive ? "text-white" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
        {(() => {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          const name = stored.fullName || stored.username || "User";
          const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{name.split(" ")[0]}</p>
                <p className="text-xs text-slate-400">@{stored.username || "user"}</p>
              </div>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
