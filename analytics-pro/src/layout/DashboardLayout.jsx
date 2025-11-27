import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import "./layout.css";

export default function DashboardLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="layout-container">
      <Sidebar isOpen={openSidebar} />
      <div className="main-section">
        <Topbar toggleSidebar={() => setOpenSidebar(!openSidebar)} />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
