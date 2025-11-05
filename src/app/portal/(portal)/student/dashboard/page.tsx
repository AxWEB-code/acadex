// src/app/portal/(portal)/student/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  ChartLine,
  ClipboardList,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
// If you already have API_BASE or fetchJSON, you can swap them in later.
// import { API_BASE } from "@/lib/config";

type MiniStats = {
  name: string;
  admissionNo: string;
  department: string;
  levelOrClass: string;
  approvalStatus: "approved" | "pending";
  averageScore: number;
  passed: number;
  failed: number;
  upcomingResits: number;
  unreadNotifications: number;
  upcomingExams: number;
};

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MiniStats | null>(null);

  // TODO: replace mock with real API calls when endpoints are ready
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Example: const me = await fetch(`${API_BASE}/api/students/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json())
        // const summaries = await fetch(`${API_BASE}/api/students/me/summary`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json())

        // Mocked data for now
        const mock: MiniStats = {
          name: "John Doe",
          admissionNo: "ADM-2025-1203",
          department: "Computer Science",
          levelOrClass: "200 Level",
          approvalStatus: "approved",
          averageScore: 72,
          passed: 8,
          failed: 2,
          upcomingResits: 1,
          unreadNotifications: 3,
          upcomingExams: 2,
        };
        if (mounted) setStats(mock);
      } catch {
        if (mounted)
          setStats({
            name: "Student",
            admissionNo: "—",
            department: "—",
            levelOrClass: "—",
            approvalStatus: "pending",
            averageScore: 0,
            passed: 0,
            failed: 0,
            upcomingResits: 0,
            unreadNotifications: 0,
            upcomingExams: 0,
          });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Glow background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Welcome / Profile banner */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222] via-[#0f1430] to-[#0a0f1f] p-6 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm">
              {stats?.approvalStatus === "approved" ? "✅ Approved" : "⏳ Pending approval"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Welcome back{stats?.name ? `, ${stats.name}` : ""} 👋
            </h2>
            <p className="mt-2 text-white/60 text-sm">
              Admission No: <span className="font-medium text-white/80">{stats?.admissionNo}</span> •{" "}
              Dept: <span className="font-medium text-white/80">{stats?.department}</span> •{" "}
              Level/Class: <span className="font-medium text-white/80">{stats?.levelOrClass}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center shadow-lg shadow-blue-600/20">
              <UserRound className="size-6" />
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Avg. Score</p>
              <p className="text-2xl font-bold">{stats?.averageScore ?? 0}%</p>
            </div>
          </div>
        </div>

        {/* Soft gradient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </motion.section>

      {/* Quick stat cards */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <DashCard
          href="/portal/student/exams"
          title="Active / Upcoming Exams"
          value={`${stats?.upcomingExams ?? 0}`}
          icon={<ClipboardList className="size-5" />}
          gradient="from-blue-500 to-cyan-500"
          subtitle="See available exams & start times"
        />
        <DashCard
          href="/portal/student/results"
          title="Results Summary"
          value={`${stats?.passed ?? 0} ✓ / ${stats?.failed ?? 0} ✗`}
          icon={<Trophy className="size-5" />}
          gradient="from-emerald-500 to-teal-500"
          subtitle="Your pass/fail overview"
        />
        <DashCard
          href="/portal/student/notifications"
          title="Unread Notifications"
          value={`${stats?.unreadNotifications ?? 0}`}
          icon={<Bell className="size-5" />}
          gradient="from-violet-500 to-indigo-500"
          subtitle="New updates and alerts"
        />
      </motion.section>

      {/* Wide cards row */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <WideCard
          href="/portal/student/exams"
          title="Exams Hub"
          description="Write live exams, check upcoming schedules, and review completed attempts."
          icon={<BookOpenCheck className="size-5" />}
          gradient="from-sky-500 to-blue-600"
        />
        <WideCard
          href="/portal/student/analytics"
          title="Performance Insights"
          description="Track your progress each term. Identify strengths and subjects to improve."
          icon={<ChartLine className="size-5" />}
          gradient="from-fuchsia-500 to-violet-600"
        />
        <WideCard
          href="/portal/student/profile"
          title="Profile & Settings"
          description="Update contact number, change password, and manage your account."
          icon={<UserRound className="size-5" />}
          gradient="from-emerald-500 to-teal-600"
        />
      </motion.section>

      {/* Placeholder mini-trend (optional) */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h3 className="text-sm font-semibold tracking-tight mb-3">Recent Performance Trend</h3>
        <p className="text-sm text-white/60">
          A sparkline / tiny chart can go here later. For now, head to{" "}
          <Link href="/portal/student/analytics" className="underline text-blue-400">
            Analytics
          </Link>{" "}
          for deeper insights.
        </p>
      </motion.section>

      {loading && (
        <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm">
            Loading dashboard…
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- UI Bits ----------------- */

function DashCard({
  href,
  title,
  value,
  icon,
  gradient,
  subtitle,
}: {
  href: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string; // e.g. "from-blue-500 to-cyan-500"
  subtitle?: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg hover:shadow-blue-500/10"
      >
        <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
          <div className={`h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30`}>
            {icon}
          </div>
        </div>
        {subtitle && <p className="mt-3 text-xs text-white/60">{subtitle}</p>}
      </motion.div>
    </Link>
  );
}

function WideCard({
  href,
  title,
  description,
  icon,
  gradient,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg"
      >
        <div className={`absolute -right-8 -top-10 h-28 w-28 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30`}>
            {icon}
          </div>
          <div>
            <h4 className="text-base font-semibold">{title}</h4>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
