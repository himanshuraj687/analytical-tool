import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <h1>Analytics Pro</h1>
      <p>A simple and powerful dashboard for CSV-based data analysis.</p>

      <Link to="/dashboard">
        <button className="btn btn-primary landing-btn">Go to Dashboard</button>
      </Link>
    </div>
  );
}
