import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdFileUpload, MdBuild, MdAssessment, MdSettings } from "react-icons/md";
import "./Sidebar.css";

export default function Sidebar({ isOpen }) {

  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">Analytics Pro</h2>

      <nav className="menu">
        <Link
          to="/"
          className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <MdDashboard className="icon" />
          Dashboard
        </Link>

        <Link
          to="/upload"
          className={`menu-item ${location.pathname === "/upload" ? "active" : ""}`}
        >
          <MdFileUpload className="icon" />
          Upload
        </Link>

        <Link
          to="/tools"
          className={`menu-item ${location.pathname === "/tools" ? "active" : ""}`}
        >
          <MdBuild className="icon" />
          Tools
        </Link>

        <Link
          to="/reports"
          className={`menu-item ${location.pathname === "/reports" ? "active" : ""}`}
        >
          <MdAssessment className="icon" />
          Reports
        </Link>

        <Link
          to="/settings"
          className={`menu-item ${location.pathname === "/settings" ? "active" : ""}`}
        >
          <MdSettings className="icon" />
          Settings
        </Link>
      </nav>
    </div>
  );
}
