import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./components/Auth/Login.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import Tools from "./pages/Tools.jsx";
import Settings from "./pages/Settings.jsx";
import Upload from "./pages/Upload.jsx";
import Reports from "./pages/Reports.jsx";
import Landing from "./pages/Landing.jsx";

// Route protection
const Protected = ({ children }) => {
  const logged = localStorage.getItem("auth");
  return logged === "loggedin" ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/upload" element={<Protected><Upload /></Protected>} />
        <Route path="/tools" element={<Protected><Tools /></Protected>} />
        <Route path="/reports" element={<Protected><Reports /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />

      </Routes>
    </BrowserRouter>
  );
}
