"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Building2,
  CheckCircle2,
  Home,
  LogOut,
  Menu,
  X,
  School,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardAltLayout() {
  const [school, setSchool] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timeout = setTimeout(() => {
      setSchool({
        name: "AcadeX University",
        logo: "/acadex-logo.png",
        subdomain: "adxuni",
        totalStudents: 320,
        totalDepartments: 5,
        activeExams: 3,
        pendingApprovals: 12,
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  /* ---------------- Skeleton Loader ---------------- */
  if (!school)
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
        {/* Sidebar skeleton */}
        <aside className="hidden md:flex flex-col justify-between w-64 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 animate-pulse">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex flex-col gap-2 w-24">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-2 w-16 bg-white/10 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-full rounded-lg bg-white/[0.05]"
                  />
                ))}
            </div>
          </div>
          <div className="h-8 w-32 bg-white/[0.05] rounded mx-auto" />
        </aside>

        {/* Main skeleton */}
        <main className="flex-1 p-8 space-y-8">
          {/* Header */}
          <div className="h-8 w-48 bg-white/[0.08] rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-white/[0.04] border border-white/10"
                />
              ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-48 rounded-2xl bg-white/[0.04]" />
            <div className="h-48 rounded-2xl bg-white/[0.04]" />
          </div>
        </main>
      </div>
    );

  /* ---------------- Actual Dashboard ---------------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* === Sidebar === */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 backdrop-blur-xl bg-white/[0.03] border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/10 grid place-items-center">
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <School className="opacity-70" size={18} />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{school.name}</h2>
                <p className="text-xs text-blue-400/70">
                  {school.subdomain}.acadex.com
                </p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 text-sm overflow-y-auto">
            <NavLink href="#" icon={<Home size={16} />} label="Overview" />
            <NavLink
              href="/portal/admin/students"
              icon={<Users size={16} />}
              label="Students"
            />
            <NavLink
              href="/portal/admin/departments"
              icon={<Building2 size={16} />}
              label="Departments"
            />
            <NavLink
              href="/portal/admin/exams"
              icon={<ClipboardList size={16} />}
              label="Exams"
            />
            <NavLink
              href="/portal/admin/results"
              icon={<GraduationCap size={16} />}
              label="Results"
            />
            <NavLink
              href="/portal/admin/analytics"
              icon={<BarChart3 size={16} />}
              label="Analytics"
            />
            <NavLink
              href="/portal/admin/settings"
              icon={<Settings size={16} />}
              label="Settings"
            />
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-3 mt-8">
          <button className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center">
            © 2025 AcadeX Portal
          </p>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 md:ml-64 px-6 py-6 space-y-8 relative overflow-x-hidden">
        {/* Mobile Topbar */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold">{school.name}</h1>
          <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center border border-white/10">
            <Image
              src={school.logo || "/acadex-logo.png"}
              alt="Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-blue-700/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            <p className="text-sm text-white/60">
              Manage school activities and monitor performance.
            </p>
          </div>
          <button className="relative text-white/70 hover:text-white transition self-start sm:self-auto">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Students"
            value={school.totalStudents}
            icon={<Users size={18} />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Departments"
            value={school.totalDepartments}
            icon={<Building2 size={18} />}
            gradient="from-indigo-500 to-violet-500"
          />
          <StatCard
            label="Active Exams"
            value={school.activeExams}
            icon={<ClipboardList size={18} />}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            label="Pending Approvals"
            value={school.pendingApprovals}
            icon={<CheckCircle2 size={18} />}
            gradient="from-amber-400 to-orange-500"
          />
        </div>

        {/* Middle Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Performance Overview</h3>
            <p className="text-sm text-white/60 mb-4">
              Student and exam performance trends (chart placeholder).
            </p>
            <div className="h-48 w-full bg-white/[0.05] rounded-xl grid place-items-center text-white/30 text-sm">
              📊 Chart area coming soon
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>✅ Approved 3 new students</li>
              <li>📘 Created exam “Midterm 2025”</li>
              <li>🧩 Added new department “Biochemistry”</li>
              <li>📊 Viewed analytics dashboard</li>
            </ul>
          </motion.div>
        </div>

        <footer className="mt-10 text-center text-xs text-white/40">
          Powered by <span className="text-blue-400 font-semibold">AcadeX</span> © 2025
        </footer>
      </main>
    </div>
  );
}

/* === Components === */
function StatCard({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-md"
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-white/60">{label}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div
          className={`h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
