// src/app/portal/(portal)/student/layout.tsx
import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0f1a] text-white antialiased">
        {/* Top header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0b0f1a]/80 via-[#0b0f1a]/60 to-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20" />
              <div>
                <p className="text-sm text-white/60">AcadeX • Student</p>
                <h1 className="text-base font-semibold tracking-tight">Portal</h1>
              </div>
            </div>

            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <a href="/portal/student/dashboard" className="px-3 py-2 rounded-lg hover:bg-white/5">Dashboard</a>
              <a href="/portal/student/exams" className="px-3 py-2 rounded-lg hover:bg-white/5">Exams</a>
              <a href="/portal/student/results" className="px-3 py-2 rounded-lg hover:bg-white/5">Results</a>
              <a href="/portal/student/notifications" className="px-3 py-2 rounded-lg hover:bg-white/5">Notifications</a>
              <a href="/portal/student/analytics" className="px-3 py-2 rounded-lg hover:bg-white/5">Analytics</a>
              <a href="/portal/student/profile" className="px-3 py-2 rounded-lg hover:bg-white/5">Profile</a>
            </nav>
          </div>
        </header>

        {/* Page content container */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
