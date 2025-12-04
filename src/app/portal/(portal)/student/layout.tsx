// src/app/portal/(portal)/student/layout.tsx

"use client";

import type { ReactNode } from "react";
import { Bell, LogOut } from "lucide-react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("acadexUser");
      window.location.href = "/portal";
    }
  };

  return (
    // 🔵 This div is now the real "page background" for student portal
    <div className="min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white antialiased">
      {/* Top header - STICKY */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0b0f1a]/80 via-[#0b0f1a]/60 to-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20" />
            <div>
              <p className="text-sm text-white/60">AcadeX • Student</p>
              <h1 className="text-base font-semibold tracking-tight">Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Navigation - Hidden on mobile, shown on sm and up */}
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <a
                href="/portal/student/dashboard"
                className="px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Dashboard
              </a>
              <a
                href="/portal/student/exams"
                className="px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Exams
              </a>
              <a
                href="/portal/student/results"
                className="px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Results
              </a>
              <a
                href="/portal/student/analytics"
                className="px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Analytics
              </a>
              <a
                href="/portal/student/profile"
                className="px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Profile
              </a>
            </nav>

            {/* Icons - Always visible */}
            <div className="flex items-center gap-4">
              <a
                href="/portal/student/notifications"
                className="relative text-white/60 hover:text-blue-400 transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              </a>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page content container */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
