import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { MdInsights, MdSpeed, MdSecurity, MdCloudUpload } from "react-icons/md";

export default function Landing() {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".hero-btn", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });
      // Floating orbs
      gsap.to(".orb-1", {
        y: -20,
        x: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-2", {
        y: 15,
        x: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-3", {
        y: -10,
        x: 20,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      // Feature cards
      gsap.from(".feature-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.8,
        ease: "power2.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: <MdCloudUpload size={28} />, title: "Easy Upload", desc: "Drag & drop CSV files for instant processing" },
    { icon: <MdInsights size={28} />, title: "Smart Analytics", desc: "Auto-generate charts and statistical insights" },
    { icon: <MdSpeed size={28} />, title: "Lightning Fast", desc: "Real-time data cleaning and visualization" },
    { icon: <MdSecurity size={28} />, title: "Secure & Private", desc: "Your data stays safe with local processing" },
  ];

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-cyan-500" />

      {/* Floating orbs */}
      <div className="orb-1 absolute top-20 left-[15%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="orb-2 absolute bottom-32 right-[10%] w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="orb-3 absolute top-[40%] right-[30%] w-64 h-64 bg-purple-400/15 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Badge */}
        <div className="hero-title mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            v2.0 — Now with Advanced Analytics
          </span>
        </div>

        {/* Title */}
        <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-white text-center leading-tight tracking-tight">
          Analytics{" "}
          <span className="bg-linear-to-r from-cyan-300 to-white bg-clip-text text-transparent">
            Pro
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mt-5 text-lg md:text-xl text-white/80 text-center max-w-xl leading-relaxed">
          A powerful, beautiful dashboard for CSV-based data analysis.
          Upload, clean, visualize, and export — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="hero-btn mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <button className="px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              Get Started
            </button>
          </Link>
          <Link to="/login">
            <button className="px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-lg border border-white/25 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
          {features.map((f, i) => (
            <div key={i} className="feature-card group p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-16 text-white/40 text-sm">
          © {new Date().getFullYear()} Analytics Pro — Built by Himanshu Raj
        </p>
      </div>
    </div>
  );
}
