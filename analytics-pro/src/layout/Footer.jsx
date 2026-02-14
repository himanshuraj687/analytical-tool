import React from "react";

export default function Footer() {
  return (
    <footer className="py-4 px-6 text-center border-t border-slate-200/60 dark:border-slate-800">
      <p className="text-sm text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-slate-500 dark:text-slate-400">Analytics Pro</span>
        {" "}— Developed by Himanshu Raj
      </p>
    </footer>
  );
}
