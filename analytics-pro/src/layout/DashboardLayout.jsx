import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />

      {/* Main area */}
      <div className="flex-1 ml-0 lg:ml-65 flex flex-col min-h-screen transition-all duration-300">
        <Topbar toggleSidebar={() => setOpenSidebar(!openSidebar)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>

      {/* Mobile overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}
    </div>
  );
}
