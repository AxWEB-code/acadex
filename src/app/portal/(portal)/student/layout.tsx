"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, FileText, BarChart3, Bell, User, LayoutDashboard, LogOut } from "lucide-react";

const navLinks = [
  { href: "/portal/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/student/exams", label: "Exams", icon: FileText },
  { href: "/portal/student/results", label: "Results", icon: GraduationCap },
  { href: "/portal/student/notifications", label: "Notifications", icon: Bell },
  { href: "/portal/student/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/student/profile", label: "Profile", icon: User },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-[#111827] border-r border-white/10 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-white/10">
              <h1 className="text-xl font-bold text-blue-400">AcadeX Student</h1>
            </div>
            <nav className="mt-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-500/20 text-blue-400 border-l-4 border-blue-500"
                        : "text-gray-400 hover:text-blue-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                localStorage.removeItem("acadexUser");
                window.location.href = "/portal";
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-blue-400">Student Portal</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">Welcome 👋</div>
              <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-sm font-bold text-blue-300">
                S
              </div>
            </div>
          </header>

          {/* Page Content */}
          <section className="flex-1 overflow-y-auto p-6">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
