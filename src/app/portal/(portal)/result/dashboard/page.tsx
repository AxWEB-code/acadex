"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BarChart3,
  ClipboardCheck,
  FileUp,
  FileText,
  Gauge,
  LogOut,
  PieChart,
  School,
  Settings,
  Table,
  CheckCircle2,
  Clock,
  Menu,
  X,
} from "lucide-react";

/* ---------------- Types ---------------- */
type SchoolInfo = { name: string; logo?: string; subdomain?: string };
type UserSession = {
  token: string;
  role?: string;
  school?: SchoolInfo;
};

/* --------------- Page --------------- */
export default function ResultDashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("acadexUser");
    if (!raw) {
      window.location.href = "/portal";
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setSession(parsed);

      if (!parsed?.token || parsed?.role !== "resultAdmin") {
        switch (parsed?.role) {
          case "mainAdmin":
            window.location.href = "/portal/admin/dashboard";
            break;
          case "admissionAdmin":
            window.location.href = "/portal/admission/dashboard";
            break;
          case "examAdmin":
            window.location.href = "/portal/exam/dashboard";
            break;
          default:
            window.location.href = "/portal";
        }
      }
    } catch {
      window.location.href = "/portal";
    }
  }, []);

  if (!session)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c0c14] to-[#0f1620] text-white p-8">
        <div className="h-10 w-40 rounded skeleton mb-6" />
        <div className="h-32 rounded-2xl border border-white/10 bg-white/[0.04] skeleton" />
      </div>
    );

  const school = session.school ?? { name: "Your School", subdomain: "" };

  const stats = [
    { label: "Uploaded Results", value: 45, icon: FileUp, gradient: "from-blue-500 to-indigo-600" },
    { label: "Pending Reviews", value: 12, icon: Clock, gradient: "from-amber-500 to-orange-600" },
    { label: "Approved Results", value: 38, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500" },
    { label: "Avg. Performance", value: "73%", icon: Gauge, gradient: "from-fuchsia-500 to-violet-600" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0a0a0f] via-[#0c0c14] to-[#0f1620] text-white overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="absolute bottom-10 right-6 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 border-r border-white/10 bg-white/[0.05] backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-5 mb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-white/10 grid place-items-center">
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <School size={18} className="opacity-70" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-tight">{school.name}</h2>
                <p className="text-[11px] text-blue-400/70 tracking-wide">
                  {school.subdomain}.acadex.com
                </p>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden text-white/60 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1 text-sm overflow-y-auto">
            <SidebarItem href="/portal/result/dashboard" icon={BarChart3} active>
              Overview
            </SidebarItem>
            <SidebarItem href="/portal/result/upload" icon={FileUp}>
              Upload Manual Result
            </SidebarItem>
            <SidebarItem href="/portal/result/review" icon={ClipboardCheck}>
              Review CBT Results
            </SidebarItem>
            <SidebarItem href="/portal/result/analytics" icon={PieChart}>
              Department Analytics
            </SidebarItem>
            <SidebarItem href="/portal/result/download" icon={FileText}>
              Download Summary
            </SidebarItem>

            <div className="h-px my-3 bg-white/10" />

            <SidebarItem href="/portal/result/settings" icon={Settings}>
              Settings
            </SidebarItem>
            <SidebarItem
              href="/portal"
              icon={LogOut}
              onClick={() => localStorage.removeItem("acadexUser")}
            >
              Logout
            </SidebarItem>
          </nav>
        </div>

        {/* Role badge */}
        <div className="p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs mb-3">
            <p className="text-white/60">Signed in as</p>
            <p className="mt-1 font-semibold text-blue-300">Result Officer</p>
          </div>
          <p className="text-xs text-white/30 text-center">© 2025 AcadeX Results</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-6 space-y-6 overflow-x-hidden">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold">{school.name}</h1>
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222] via-[#0f1430] to-[#0a0f1f] p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold">Result Overview</h1>
            <p className="text-sm text-white/60">
              Manage uploaded results, reviews, and performance analytics.
            </p>
          </div>
          <Table className="text-blue-400/70 self-center" size={22} />
        </motion.div>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} Icon={s.icon} gradient={s.gradient} />
          ))}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <ActionCard
            href="/portal/result/upload"
            title="Upload Manual Result"
            description="Add practical or external scores manually."
            gradient="from-blue-500 to-indigo-600"
            Icon={FileUp}
          />
          <ActionCard
            href="/portal/result/review"
            title="Review CBT Results"
            description="View and verify CBT-generated scores."
            gradient="from-emerald-500 to-teal-600"
            Icon={ClipboardCheck}
          />
          <ActionCard
            href="/portal/result/analytics"
            title="Department Analytics"
            description="Check performance across departments."
            gradient="from-amber-500 to-orange-600"
            Icon={BarChart3}
          />
          <ActionCard
            href="/portal/result/download"
            title="Download Summary"
            description="Export performance and grading sheets."
            gradient="from-fuchsia-500 to-violet-600"
            Icon={FileText}
          />
        </motion.section>

        {/* Recent Uploads */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-3 text-sm">
            {[
              { course: "NUR 302 Pharmacology", level: "300 Level", status: "Reviewed" },
              { course: "PHY 101 Basic Physics", level: "100 Level", status: "Pending" },
              { course: "BIO 204 Anatomy II", level: "200 Level", status: "Approved" },
            ].map((r, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-white/10 bg-white/[0.03] rounded-xl px-4 py-3 gap-2"
              >
                <div>
                  <p className="font-medium text-white">{r.course}</p>
                  <p className="text-xs text-white/60">{r.level}</p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    r.status === "Pending"
                      ? "text-amber-400"
                      : r.status === "Reviewed"
                      ? "text-blue-400"
                      : "text-emerald-400"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-white/40">
          Powered by <span className="text-blue-400 font-semibold">AcadeX</span> © 2025
        </footer>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */
function SidebarItem({
  href,
  icon: Icon,
  children,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}

function StatCard({
  label,
  value,
  Icon,
  gradient,
}: {
  label: string;
  value: number | string;
  Icon: React.ElementType;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg"
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-white/60">{label}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div
          className={`h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
        >
          <Icon className="size-4" />
        </div>
      </div>
    </motion.div>
  );
}

function ActionCard({
  href,
  title,
  description,
  gradient,
  Icon,
}: {
  href: string;
  title: string;
  description: string;
  gradient: string;
  Icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg h-[130px]"
      >
        <div
          className={`absolute -right-8 -top-10 h-28 w-28 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}
        />
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <h4
              className={`text-base font-semibold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
            >
              {title}
            </h4>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
