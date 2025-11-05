"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Trophy,
  ChartLine,
  ClipboardList,
  GraduationCap,
  UserRound,
  Settings,
  Medal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type MiniStats = {
  name: string;
  rollNumber: string;
  admissionNo: string;
  department: string;
  levelOrClass: string;
  approvalStatus: "approved" | "pending";
  averageScore: number;
  unreadNotifications: number;
  school: { name: string; logo?: string };
};

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MiniStats | null>(null);

  useEffect(() => {
    (async () => {
      // TODO: replace this mock with real API call later
      const mock: MiniStats = {
        name: "John Doe",
        rollNumber: "ECNS2025-015",
        admissionNo: "ADM-2025-1203",
        department: "Computer Science",
        levelOrClass: "200 Level",
        approvalStatus: "approved",
        averageScore: 82,
        unreadNotifications: 3,
        school: {
          name: "Ezeala College",
          logo: "/acadex-logo.png",
        },
      };
      setStats(mock);
      setLoading(false);
    })();
  }, []);

  if (loading || !stats)
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm">
          Loading dashboard…
        </div>
      </div>
    );

  return (
    <div className="space-y-8 relative">
      {/* Glow background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Welcome / Profile Banner */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222] via-[#0f1430] to-[#0a0f1f] p-8 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-400 to-cyan-500 opacity-30 blur-md"
              ></motion.div>
              <div className="relative w-16 h-16 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shadow-inner">
                {stats.school.logo ? (
                  <Image
                    src={stats.school.logo}
                    alt={stats.school.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-blue-400">
                    {stats.school.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">{stats.school.name}</h3>
              <p
                className={`text-sm mt-1 ${
                  stats.approvalStatus === "approved"
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }`}
              >
                {stats.approvalStatus === "approved"
                  ? "✅ Approved"
                  : "⏳ Pending Approval"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back, {stats.name} 👋
            </h2>
            <p className="mt-2 text-white/70 text-sm">
              Roll No:{" "}
              <span className="font-medium text-white/90">{stats.rollNumber}</span> •{" "}
              Admission No:{" "}
              <span className="font-medium text-white/90">{stats.admissionNo}</span>
            </p>
            <p className="text-white/60 text-sm mt-1">
              Dept: <span className="font-medium text-white/80">{stats.department}</span>{" "}
              • Level:{" "}
              <span className="font-medium text-white/80">{stats.levelOrClass}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center shadow-lg shadow-blue-600/20">
              <UserRound className="size-6" />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl"
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Average Score</p>
              <p className="text-3xl font-bold text-blue-400">
                {stats.averageScore}%
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Top Stat Cards */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <DashCard
          href="/portal/student/exams"
          title="Exams"
          value="All Exams"
          icon={<ClipboardList className="size-5" />}
          gradient="from-blue-500 to-cyan-500"
          subtitle="Access live and resit exams"
        />
        <DashCard
          href="/portal/student/results"
          title="Results"
          value="View Scores"
          icon={<GraduationCap className="size-5" />}
          gradient="from-emerald-500 to-teal-500"
          subtitle="Check your grades and remarks"
        />
        <DashCard
          href="/portal/student/notifications"
          title="Notifications"
          value={`${stats.unreadNotifications}`}
          icon={<Bell className="size-5" />}
          gradient="from-violet-500 to-indigo-500"
          subtitle="Stay updated"
        />
      </motion.section>

      {/* Secondary Row */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <WideCard
          href="/portal/student/analytics"
          title="Performance Insights"
          description="Visualize progress across sessions and subjects."
          icon={<ChartLine className="size-5" />}
          gradient="from-fuchsia-500 to-violet-600"
        />
        <WideCard
          href="/portal/student/leaderboard"
          title="Leaderboard"
          description="See how you rank among classmates and departments."
          icon={<Medal className="size-5" />}
          gradient="from-amber-400 to-orange-500"
        />
        <WideCard
          href="/portal/student/profile"
          title="Profile & Settings"
          description="Edit contact details or password securely."
          icon={<Settings className="size-5" />}
          gradient="from-emerald-500 to-teal-600"
        />
      </motion.section>

      {/* Performance placeholder */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
      >
        <h3 className="text-sm font-semibold tracking-tight mb-3 text-blue-300">
          Recent Performance Trend
        </h3>
        <p className="text-sm text-white/60">
          Visit{" "}
          <Link href="/portal/student/analytics" className="underline text-blue-400">
            Analytics
          </Link>{" "}
          for your latest graphs and statistics.
        </p>
      </motion.section>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-white/40">
        Powered by <span className="text-blue-400 font-semibold">AcadeX</span> © 2025
      </footer>
    </div>
  );
}

/* -------- UI Components -------- */

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
  gradient: string;
  subtitle?: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg hover:shadow-blue-500/10"
      >
        <div
          className={`absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
          <div
            className={`h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
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
        <div
          className={`absolute -right-8 -top-10 h-28 w-28 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`}
        />
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30`}
          >
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
