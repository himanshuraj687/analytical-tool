import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MdPerson, MdEdit, MdSecurity, MdCheckCircle } from "react-icons/md";
import axios from "axios";

export default function Profile() {
  const pageRef = useRef(null);
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [fullName, setFullName] = useState(stored.fullName || "");
  const [email, setEmail] = useState(stored.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  const initials = (fullName || stored.username || "U")
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-anim", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleSave = async () => {
    setMsg(""); setErr("");
    if (!fullName.trim() && !email.trim()) { setErr("Enter at least one field"); return; }
    setSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/profile/${stored.username}`, { fullName: fullName.trim(), email: email.trim() });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg(res.data.message);
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to update profile");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPwMsg(""); setPwErr("");
    if (!currentPassword || !newPassword) { setPwErr("Fill in all password fields"); return; }
    if (newPassword.length < 6) { setPwErr("New password must be 6+ characters"); return; }
    if (newPassword !== confirmPassword) { setPwErr("New passwords don't match"); return; }
    setChangingPw(true);
    try {
      const res = await axios.put(`http://localhost:5000/change-password/${stored.username}`, { currentPassword, newPassword });
      setPwMsg(res.data.message);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e) {
      setPwErr(e.response?.data?.error || "Failed to change password");
    } finally { setChangingPw(false); }
  };

  return (
      <div ref={pageRef} className="max-w-3xl">
        {/* Header */}
        <div className="profile-anim mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <MdPerson className="text-indigo-500" /> Profile
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal details</p>
        </div>

        {/* Profile Card */}
        <div className="profile-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm mb-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{fullName || stored.username}</h3>
              <p className="text-sm text-slate-400">@{stored.username || "user"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{email || "No email set"}</p>
            </div>
          </div>
        </div>

        {/* Update Info */}
        <div className="profile-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-4">
            <MdEdit className="text-emerald-500" size={20} />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Update Information</h3>
          </div>

          {msg && <div className="mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm"><MdCheckCircle />{msg}</div>}
          {err && <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}

          <div className="space-y-3">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="profile-anim bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MdSecurity className="text-red-500" size={20} />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Security</h3>
          </div>

          {!showPwForm ? (
            <button
              onClick={() => setShowPwForm(true)}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-medium text-sm transition-all duration-300 cursor-pointer"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-3">
              {pwMsg && <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm"><MdCheckCircle />{pwMsg}</div>}
              {pwErr && <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{pwErr}</div>}
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPwErr(""); }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPwErr(""); }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPwErr(""); }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPw}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {changingPw ? "Changing..." : "Update Password"}
                </button>
                <button
                  onClick={() => { setShowPwForm(false); setPwErr(""); setPwMsg(""); }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
