import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "./Profile.css";

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="profile-container">

        <h2 className="profile-title">User Profile</h2>
        <p className="profile-sub">Manage your personal details</p>

        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-pic"
          />

          <div className="profile-info">
            <p><strong>Name:</strong> User</p>
            <p><strong>Role:</strong> Student / Developer</p>
            <p><strong>Email:</strong> user@example.com</p>
          </div>
        </div>

        <div className="profile-card">
          <h3>Update Information</h3>

          <input className="profile-input" placeholder="Name" />
          <input className="profile-input" placeholder="Email" />
          <button className="btn btn-primary">Save Changes</button>
        </div>

        <div className="profile-card">
          <h3>Security</h3>
          <button className="btn btn-danger">Change Password</button>
        </div>

      </div>
    </DashboardLayout>
  );
}
