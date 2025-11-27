import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <p>© {new Date().getFullYear()} Analytics Pro — Developed By Himanshu Raj</p>
    </div>
  );
}
