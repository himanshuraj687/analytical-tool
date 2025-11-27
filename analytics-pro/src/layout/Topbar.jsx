import React from "react";
import { MdDarkMode, MdLogout, MdSearch } from "react-icons/md";
import { MdMenu } from "react-icons/md";

import "./Topbar.css";

export default function Topbar({ onToggleDark, onLogout, toggleSidebar }) {
  return (
    <div className="topbar">

      {/* Hamburger for Mobile */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <MdMenu size={26} />
      </button>

      {/* Search Box */}
      <div className="search-container">
        <MdSearch className="search-icon" />
        <input className="search-box" placeholder="Search dataset..." />
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        <button className="icon-btn" onClick={onToggleDark}>
          <MdDarkMode size={22} />
        </button>
        <button className="icon-btn logout-btn" onClick={onLogout}>
          <MdLogout size={22} />
        </button>
      </div>
    </div>
  );
}
