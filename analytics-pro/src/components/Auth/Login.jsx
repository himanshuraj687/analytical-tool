import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    if (username === "admin" && password === "123456") {
      localStorage.setItem("auth", "loggedin");
      window.location.href = "/dashboard"; 
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Analytics Pro</h2>

      <input
        type="text"
        placeholder="Username"
        className="login-input"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="login-input"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary login-btn" onClick={loginHandler}>
        Login
      </button>
    </div>
  );
}
