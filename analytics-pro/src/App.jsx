import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Pages
import Login from "./components/Auth/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import Tools from "./pages/Tools.jsx";
import Settings from "./pages/Settings.jsx";
import Upload from "./pages/Upload.jsx";
import Reports from "./pages/Reports.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";

// Route protection + shared layout (Sidebar stays mounted across pages)
const ProtectedLayout = () => {
  const logged = localStorage.getItem("auth");
  if (logged !== "loggedin") return <Navigate to="/login" />;
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — shared layout keeps Sidebar mounted */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
