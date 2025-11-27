"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Key,
  Settings,
  LogOut,
  Activity,
  WifiOff,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

function cn(...classes: (string | null | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SuperAdminDashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const featureCards = [
    {
      title: "Create New Exam",
      desc: "Set up a fresh exam session, configure mode, duration, and security rules.",
      icon: BookOpen,
      href: "/superadmin/exams/create",
      accent: "from-blue-500/30 to-sky-400/20",
      pill: "Core Exam Engine",
    },
    {
      title: "Manage Exams",
      desc: "View all exams, adjust schedules, approve or close sessions.",
      icon: ShieldCheck,
      href: "/superadmin/exams",
      accent: "from-sky-400/25 to-cyan-400/10",
      pill: "Control Center",
    },
    {
      title: "Live Invigilation",
      desc: "Monitor active exams in real time, flag or force-submit suspicious sessions.",
      icon: Activity,
      href: "/superadmin/live",
      accent: "from-purple-500/30 to-fuchsia-500/10",
      pill: "Security & Monitoring",
    },
    {
      title: "Schools Management",
      desc: "Onboard schools, manage plans, and control access to AcadeX.",
      icon: Building2,
      href: "/superadmin/schools",
      accent: "from-slate-300/30 to-slate-500/10",
      pill: "Multi-School",
    },
    {
      title: "Admin Accounts",
      desc: "Create and manage super admins, school admins and future invigilators.",
      icon: Users,
      href: "/superadmin/admins",
      accent: "from-indigo-400/30 to-blue-500/10",
      pill: "Access Control",
    },
    {
      title: "Exam Tokens & Access Keys",
      desc: "Generate secure tokens that invigilators use to access live exams.",
      icon: Key,
      href: "/superadmin/keys",
      accent: "from-teal-400/30 to-emerald-400/10",
      pill: "Secure Access",
    },
    {
      title: "Results & Reporting",
      desc: "Review results, export sheets, and audit grading outcomes.",
      icon: BarChart3,
      href: "/superadmin/results",
      accent: "from-emerald-400/30 to-lime-400/10",
      pill: "Analytics",
    },
    {
      title: "System Logs & Audit Trail",
      desc: "Trace every action — logins, exam edits, attempts and result changes.",
      icon: FileText,
      href: "/superadmin/logs",
      accent: "from-rose-400/30 to-orange-400/10",
      pill: "Audit & Compliance",
    },
    {
      title: "Platform Settings",
      desc: "Define global exam rules, grading patterns and offline mode behaviour.",
      icon: Settings,
      href: "/superadmin/settings",
      accent: "from-zinc-200/30 to-zinc-500/10",
      pill: "Platform Rules",
    },
    {
      title: "Offline Mode Console",
      desc: "Prepare local server packages, sync offline results, and review sync logs.",
      icon: WifiOff,
      href: "/superadmin/offline",
      accent: "from-amber-400/30 to-yellow-400/10",
      pill: "Local Server",
    },
  ];

  return (
    <FadeIn>
      <div className="min-h-screen flex bg-gradient-to-b from-[#040509] via-[#060814] to-[#05070f] text-white overflow-hidden">
        {/* Glow layers */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-24 -left-10 w-[420px] h-[420px] bg-blue-700/20 blur-[140px]" />
          <div className="absolute bottom-[-120px] right-[-80px] w-[520px] h-[520px] bg-fuchsia-700/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)]" />
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-white/10 bg-black/40 flex flex-col justify-between transition-transform duration-300 z-40",
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div>
            {/* Sidebar header */}
            <div className="px-5 py-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <Image
                  src="/acadex-logo.png"
                  alt="AcadeX"
                  width={36}
                  height={36}
                  className="rounded-full border border-white/30 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                />
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    AcadeX Console
                  </h2>
                  <p className="text-[11px] text-blue-300/80">
                    SuperAdmin Access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-4 text-sm space-y-1">
              <NavItem href="/superadmin/dashboard" icon={Home}>
                Overview
              </NavItem>
              <NavItem href="/superadmin/schools" icon={Building2}>
                Schools
              </NavItem>
              <NavItem href="/superadmin/exams" icon={BookOpen}>
                Exams
              </NavItem>
              <NavItem href="/superadmin/admins" icon={Users}>
                Admin Accounts
              </NavItem>
              <NavItem href="/superadmin/results" icon={BarChart3}>
                Results
              </NavItem>
              <NavItem href="/superadmin/logs" icon={FileText}>
                Logs & Activities
              </NavItem>
              <NavItem href="/superadmin/keys" icon={Key}>
                Access Keys
              </NavItem>
              <NavItem href="/superadmin/settings" icon={Settings}>
                Platform Settings
              </NavItem>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs mb-3">
              <p className="text-white/60">Logged in as</p>
              <p className="font-semibold text-blue-300 mt-1">SuperAdmin</p>
            </div>
            <NavItem href="/portal" icon={LogOut}>
              Logout
            </NavItem>
            <p className="text-xs text-white/30 text-center mt-3">
              © {new Date().getFullYear()} AcadeX Console
            </p>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 space-y-8 max-w-full overflow-x-hidden">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold">SuperAdmin</h1>
            <Image
              src="/acadex-logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="rounded-full border border-white/30"
            />
          </div>

          {/* Top header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <p className="text-[11px] tracking-[0.2em] uppercase text-blue-300/70">
                Superadmin Control Hub
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <ShieldCheck className="text-blue-400" size={22} />
                AcadeX Global Exam Console
              </h1>
              <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                Orchestrate exams, monitor live sessions, manage schools and keep
                every assessment under strict, professional control.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                href="/superadmin/exams/create"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 text-xs sm:text-sm font-medium shadow-[0_0_18px_rgba(56,189,248,0.6)] hover:opacity-95 transition"
              >
                <BookOpen size={14} />
                New Exam
              </Link>
              <Link
                href="/superadmin/live"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 transition"
              >
                <Activity size={14} />
                View Live Sessions
              </Link>
            </div>
          </motion.div>

          {/* Feature cards grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-sm font-medium text-white/80">
                Console Shortcuts
              </h2>
              <p className="text-[11px] text-white/40">
                Choose an action below to jump straight into a module.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * index, duration: 0.35 }}
                    whileHover={{
                      y: -4,
                      scale: 1.01,
                    }}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-[0_0_35px_rgba(15,23,42,0.85)]"
                  >
                    {/* Accent glow */}
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-70",
                        `bg-gradient-to-br ${card.accent}`
                      )}
                    />

                    <Link
                      href={card.href}
                      className="relative flex h-full flex-col justify-between px-4 py-4 sm:px-5 sm:py-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl border border-white/15 bg-black/40 p-2 shadow-inner shadow-black/70">
                            <Icon
                              size={18}
                              className="text-sky-300 group-hover:text-sky-100 transition"
                            />
                          </div>
                          <div>
                            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                              <span className="h-[2px] w-4 rounded-full bg-gradient-to-r from-blue-400 to-fuchsia-400" />
                              {card.pill}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold">
                              {card.title}
                            </h3>
                          </div>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-white/40 group-hover:text-white/80 transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </div>

                      <p className="mt-3 text-xs text-white/55 leading-relaxed">
                        {card.desc}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
                        <span className="inline-flex items-center gap-1">
                          <span className="h-[6px] w-[6px] rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                          Ready to use
                        </span>
                        <span className="inline-flex items-center gap-1 group-hover:text-sky-200 transition">
                          Open module
                          <ArrowRight size={11} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <footer className="mt-4 text-center text-[11px] text-white/35">
            Powered by{" "}
            <span className="text-blue-300 font-semibold">
              AxWEB Technologies
            </span>{" "}
            ⚡ — making digital exams smarter, smoother & more secure.
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Reusable Nav Item ---------- */

function NavItem({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/superadmin/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        isActive
          ? "bg-white/12 text-white shadow-[0_0_18px_rgba(56,189,248,0.45)] border border-white/15"
          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "size-4",
          isActive ? "text-sky-300" : "text-white/60"
        )}
      />
      <span>{children}</span>
    </Link>
  );
}
