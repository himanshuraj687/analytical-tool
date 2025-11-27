import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "./Settings.css";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedAnim = localStorage.getItem("animations");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }

    if (savedAnim === "off") {
      setAnimations(false);
    }
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
  };

  const toggleAnimations = () => {
    const newAnim = !animations;
    setAnimations(newAnim);

    if (!newAnim) localStorage.setItem("animations", "off");
    else localStorage.setItem("animations", "on");
  };

  return (
    <DashboardLayout>
      <div className="settings-container">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-sub">Manage your preferences</p>

        {/* User Profile */}
        <div className="settings-card">
          <h3>User Profile</h3>
          <p><strong>Name:</strong> User</p>
          <p><strong>Role:</strong> Student / Developer</p>
          <p><strong>App:</strong> Analytics Pro</p>
        </div>

        {/* Appearance */}
        <div className="settings-card">
          <h3>Appearance</h3>

          <div className="settings-option">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </div>

          <div className="settings-option">
            <span>Animations</span>
            <input
              type="checkbox"
              checked={animations}
              onChange={toggleAnimations}
            />
          </div>
        </div>

        {/* App Info */}
        <div className="settings-card">
          <h3>Application Info</h3>
          <p><strong>Project:</strong> Analytical Tools Dashboard</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Developer:</strong> You</p>
        </div>

      </div>
    </DashboardLayout>
  );
}
