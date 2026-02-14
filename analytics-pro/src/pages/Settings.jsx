import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdSettings, MdPerson, MdPalette, MdInfo } from "react-icons/md";

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${checked ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : ""}`}
    />
  </button>
);

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const pageRef = useRef(null);

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = stored.fullName || stored.username || "User";
  const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedAnim = localStorage.getItem("animations");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
    if (savedAnim === "off") setAnimations(false);

    // Listen for theme changes from Topbar
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");
      setDarkMode(theme === "dark");
    };
    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".settings-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Dispatch custom event so Topbar can sync
    window.dispatchEvent(new Event("themechange"));
  };

  const toggleAnimations = () => {
    const newAnim = !animations;
    setAnimations(newAnim);
    localStorage.setItem("animations", newAnim ? "on" : "off");
  };

  return (
      <div ref={pageRef} className="max-w-3xl">
        {/* Header */}
        <div className="settings-anim mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <MdSettings className="text-indigo-500" /> Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your preferences</p>
        </div>

        {/* User Profile */}
        <div className="settings-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-4">
            <MdPerson className="text-indigo-500" size={20} />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">User Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              {initials}
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-white">{userName}</p>
              <p className="text-sm text-slate-400">@{stored.username || "user"}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400">App</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Analytics Pro</span>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-4">
            <MdPalette className="text-amber-500" size={20} />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Appearance</h3>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                <p className="text-xs text-slate-400">Switch between light and dark themes</p>
              </div>
              <Toggle checked={darkMode} onChange={toggleDarkMode} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Animations</p>
                <p className="text-xs text-slate-400">Enable or disable UI animations</p>
              </div>
              <Toggle checked={animations} onChange={toggleAnimations} />
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="settings-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MdInfo className="text-cyan-500" size={20} />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Application Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400">Project</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Analytical Tools Dashboard</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400">Version</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">v2.0.0</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Developer</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Himanshu Raj</span>
            </div>
          </div>
        </div>
      </div>
  );
}
