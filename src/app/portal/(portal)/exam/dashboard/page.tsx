"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  ClipboardList,
  FileText,
  FileCheck,
  FileSignature,
  BarChart3,
  Settings,
  LogOut,
  School,
  ShieldCheck,
  Timer,
  ListChecks,
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
export default function ExamDashboardPage() {
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

      if (!parsed?.token || parsed?.role !== "examAdmin") {
        switch (parsed?.role) {
          case "mainAdmin":
            window.location.href = "/portal/admin/dashboard";
            break;
          case "admissionAdmin":
            window.location.href = "/portal/admission/dashboard";
            break;
          case "resultAdmin":
            window.location.href = "/portal/result/dashboard";
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
    { label: "Pending Exams", value: 3, icon: Timer, gradient: "from-amber-500 to-orange-600" },
    { label: "Approved Exams", value: 8, icon: ShieldCheck, gradient: "from-emerald-500 to-teal-500" },
    { label: "Live Exams", value: 2, icon: LayoutGrid, gradient: "from-blue-500 to-indigo-600" },
    { label: "Submitted Papers", value: 120, icon: ListChecks, gradient: "from-fuchsia-500 to-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c0c14] to-[#0f1620] text-white flex">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="absolute bottom-10 right-6 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      {/* Sidebar (hidden on mobile) */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-white/10 grid place-items-center">
              {school.logo ? (
                <Image src={school.logo} alt={school.name} width={40} height={40} className="object-contain" />
              ) : (
                <School className="opacity-80" size={18} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{school.name}</p>
              <p className="text-[11px] text-white/50">{school.subdomain}.acadex.com</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-white/60 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 text-sm">
          <SidebarItem href="/portal/exam/dashboard" icon={LayoutGrid} active>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/portal/exam/create" icon={FileSignature}>
            Create Exam
          </SidebarItem>
          <SidebarItem href="/portal/exam/manage" icon={FileCheck}>
            Manage Exams
          </SidebarItem>
          <SidebarItem href="/portal/exam/questions" icon={FileText}>
            View Exam Questions
          </SidebarItem>
          <SidebarItem href="/portal/exam/submissions" icon={ClipboardList}>
            View Submissions
          </SidebarItem>

          <div className="h-px my-3 bg-white/10" />

          <SidebarItem href="/portal/exam/settings" icon={Settings}>
            Settings
          </SidebarItem>
          <SidebarItem
            href="/portal"
            icon={LogOut}
            onClick={() => {
              localStorage.removeItem("acadexUser");
            }}
          >
            Logout
          </SidebarItem>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs">
            <p className="text-white/60">Signed in as</p>
            <p className="mt-1 font-semibold text-blue-300">Exam Officer</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-6 w-full">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold">{school.name}</h1>
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
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222] via-[#0f1430] to-[#0a0f1f] p-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm">Role: Exam Officer</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Welcome back 👋
              </h2>
              <p className="mt-2 text-white/60 text-sm">
                Prepare, manage, and review your institution’s examinations with ease.
              </p>
            </div>
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center shadow-lg shadow-blue-600/20 self-center">
              <ShieldCheck className="size-6" />
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl"
              />
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6"
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
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-6"
        >
          <ActionCard
            href="/portal/exam/create"
            title="Create New Exam"
            description="Set title, types, duration, department/level."
            gradient="from-blue-500 to-indigo-600"
            Icon={FileSignature}
          />
          <ActionCard
            href="/portal/exam/manage"
            title="Manage Exams"
            description="Edit, submit for approval, or duplicate."
            gradient="from-emerald-500 to-teal-600"
            Icon={FileCheck}
          />
          <ActionCard
            href="/portal/exam/questions"
            title="View Exam Questions"
            description="Browse and preview per course/section."
            gradient="from-amber-500 to-orange-600"
            Icon={FileText}
          />
          <ActionCard
            href="/portal/exam/submissions"
            title="View Submissions"
            description="Track attendance and completed papers."
            gradient="from-fuchsia-500 to-violet-600"
            Icon={ClipboardList}
          />
        </motion.section>

        {/* Insights */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 opacity-80" /> Upcoming Exams
              </h3>
              <Link href="/portal/exam/manage" className="text-xs text-blue-300 hover:text-blue-200">
                View all →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { title: "PHY 101 Mid-Semester", meta: "100 Level • First Semester • 60 mins" },
                { title: "NUR 203 Anatomy II", meta: "200 Level • Second Semester • 90 mins" },
                { title: "GST 112 Use of English", meta: "100 Level • First Semester • 45 mins" },
              ].map((x, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium">{x.title}</p>
                    <p className="text-xs text-white/60">{x.meta}</p>
                  </div>
                  <Link href="/portal/exam/manage" className="text-xs text-blue-300 hover:text-blue-200">
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-base font-semibold">Quick Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• Submit exams for approval before going live.</li>
              <li>• Separate Objective, Theory, Practical into sections.</li>
              <li>• Use “Duplicate” in Manage Exams to speed up setup.</li>
            </ul>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-white/40">
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
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/[0.06] hover:text-white"
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
          <p
            className={`text-xs uppercase tracking-wider bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
          >
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        <div
          className={`h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
        >
          <Icon className="size-5" />
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
