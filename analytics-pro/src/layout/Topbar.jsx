import React, { useState, useEffect, useRef } from "react";
import { MdDarkMode, MdLightMode, MdLogout, MdSearch, MdMenu, MdNotifications, MdClose, MdCheckCircle, MdWarning, MdInfo, MdUploadFile } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const defaultNotifications = [
  { id: 1, type: "info", title: "Welcome to Analytics Pro!", message: "Explore the dashboard and upload your datasets.", time: "Just now", read: false },
  { id: 2, type: "success", title: "System Ready", message: "All services are running smoothly.", time: "2 min ago", read: false },
  { id: 3, type: "warning", title: "Storage Notice", message: "You have used 60% of your upload quota.", time: "1 hour ago", read: false },
  { id: 4, type: "upload", title: "Upload Tip", message: "Supported formats: CSV, XLSX, JSON.", time: "3 hours ago", read: true },
];

const typeIcon = {
  info: <MdInfo className="text-blue-500" size={18} />,
  success: <MdCheckCircle className="text-emerald-500" size={18} />,
  warning: <MdWarning className="text-amber-500" size={18} />,
  upload: <MdUploadFile className="text-indigo-500" size={18} />,
};

export default function Topbar({ toggleSidebar }) {
  const [darkMode, setDarkMode] = useState(document.body.classList.contains("dark"));
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : defaultNotifications;
  });
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sync dark mode if changed from Settings page
  useEffect(() => {
    const handleStorage = () => {
      const theme = localStorage.getItem("theme");
      const shouldBeDark = theme === "dark";
      setDarkMode(shouldBeDark);
      if (shouldBeDark) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    };
    window.addEventListener("storage", handleStorage);

    // Also poll for same-tab changes (storage event only fires cross-tab)
    const interval = setInterval(() => {
      const theme = localStorage.getItem("theme");
      const isDark = theme === "dark";
      if (isDark !== darkMode) {
        setDarkMode(isDark);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Dispatch custom event so Settings page can sync
    window.dispatchEvent(new Event("themechange"));
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markOneRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem("notifications", JSON.stringify([]));
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800">

      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
        >
          <MdMenu size={22} />
        </button>

        <div className="relative hidden sm:block">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            placeholder="Search datasets..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <MdNotifications size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold leading-none px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                  Notifications {unreadCount > 0 && <span className="ml-1 text-xs text-indigo-500">({unreadCount} new)</span>}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotif(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <MdNotifications className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                    <p className="text-sm text-slate-400">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markOneRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-50 dark:border-slate-700/30 last:border-0 ${
                        !n.read ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{typeIcon[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${!n.read ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{n.message}</p>
                        <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-500 font-medium cursor-pointer"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={handleToggleDark}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
        >
          {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-1 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm font-medium transition-all duration-200 cursor-pointer"
        >
          <MdLogout size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
