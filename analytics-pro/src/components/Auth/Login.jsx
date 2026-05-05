import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdInsights, MdLock, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".login-field", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const shake = () => {
    gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true, ease: "power2.inOut", onComplete: () => gsap.set(cardRef.current, { x: 0 }) });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("https://analytical-tool-zxge.onrender.com/login", { username, password });
      localStorage.setItem("auth", "loggedin");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Invalid username or password");
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900" />
      <div className="absolute top-20 left-[20%] w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MdInsights size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Analytics Pro</h1>
          </div>

          <h2 className="text-center text-white/80 text-sm mb-6">Sign in to your dashboard</h2>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={loginHandler} className="space-y-4">
            <div className="login-field">
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="text" placeholder="Enter username" value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all duration-300" />
              </div>
            </div>

            <div className="login-field">
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="password" placeholder="Enter password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all duration-300" />
              </div>
            </div>

            <div className="login-field pt-2">
              <button type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing In...
                  </span>
                ) : "Sign In"}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-5 text-center space-y-2">
            <p className="text-white/40 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200">
                Sign Up
              </Link>
            </p>
            <Link to="/" className="text-white/40 text-sm hover:text-white/60 transition-colors duration-200 block">← Back to Home</Link>
          </div>

          <div className="mt-5 pt-5 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs mb-1">Demo credentials</p>
            <p className="text-white/50 text-xs font-mono">admin / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
