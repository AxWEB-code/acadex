"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdmissionDashboard() {
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    // Temporary mock data — replace with real fetch later
    setSchool({
      name: "Ezeala College of Nursing",
      logo: "/acadex-logo.png",
      subdomain: "ezealacollege",
      stats: {
        pending: 42,
        approved: 128,
        rejected: 8,
        session: "2025/2026",
      },
      activities: [
        { type: "approved", name: "Okoro Faith", time: "2 hrs ago" },
        { type: "new", name: "Ikechukwu Samuel", time: "3 hrs ago" },
        { type: "rejected", name: "Adaeze Onyeka", time: "5 hrs ago" },
      ],
    });
  }, []);

  if (!school)
    return <div className="text-white/70 p-8">Loading Admission Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f1f] via-[#0e1428] to-[#070b14] text-white">
      {/* === Sidebar === */}
      <aside className="fixed top-0 left-0 h-full w-64 backdrop-blur-xl bg-white/[0.03] border-r border-white/10 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={school.logo}
                alt={school.name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{school.name}</h2>
              <p className="text-xs text-blue-400/70">
                {school.subdomain}.acadex.com
              </p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <NavLink href="#" icon={<Home size={16} />} label="Overview" />
            <NavLink href="#" icon={<Users size={16} />} label="Applicants" />
            <NavLink href="#" icon={<BarChart3 size={16} />} label="Reports" />
            <NavLink href="#" icon={<Settings size={16} />} label="Settings" />
          </nav>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center">
            © 2025 AcadeX Admission
          </p>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="ml-64 flex-1 px-8 py-6 space-y-8 relative">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-blue-700/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Admission Overview</h1>
            <p className="text-sm text-white/60">
              Manage applicants and admission approvals for {school.stats.session}.
            </p>
          </div>
          <button className="relative text-white/70 hover:text-white transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pending Applications"
            value={school.stats.pending}
            icon={<Clock size={18} />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Approved Students"
            value={school.stats.approved}
            icon={<CheckCircle2 size={18} />}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatCard
            label="Rejected Applications"
            value={school.stats.rejected}
            icon={<XCircle size={18} />}
            gradient="from-red-500 to-rose-500"
          />
          <StatCard
            label="Current Session"
            value={school.stats.session}
            icon={<ClipboardCheck size={18} />}
            gradient="from-amber-400 to-orange-500"
          />
        </div>

        {/* Applicants and Activity Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applicants */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">Recent Applicants</h3>
            <div className="space-y-3">
              <ApplicantRow
                name="Chidera Nwachukwu"
                department="Nursing"
                status="pending"
              />
              <ApplicantRow
                name="Emeka Obi"
                department="Midwifery"
                status="approved"
              />
              <ApplicantRow
                name="Peace Okwara"
                department="Public Health"
                status="rejected"
              />
              <ApplicantRow
                name="John Doe"
                department="Pharmacy"
                status="pending"
              />
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {school.activities.map((a, i) => (
                <li key={i} className="flex items-center gap-2">
                  {a.type === "approved" && (
                    <CheckCircle2 className="text-green-400" size={14} />
                  )}
                  {a.type === "new" && (
                    <UserPlus className="text-blue-400" size={14} />
                  )}
                  {a.type === "rejected" && (
                    <XCircle className="text-red-400" size={14} />
                  )}
                  <span className="text-white/80 font-medium">{a.name}</span>
                  <span className="text-white/50 text-xs">• {a.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-white/40">
          Powered by <span className="text-blue-400 font-semibold">AcadeX</span> © 2025
        </footer>
      </main>
    </div>
  );
}

/* === Components === */
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

function StatCard({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: string | number;
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

function ApplicantRow({
  name,
  department,
  status,
}: {
  name: string;
  department: string;
  status: "pending" | "approved" | "rejected";
}) {
  const statusColors: Record<string, string> = {
    pending: "text-amber-400",
    approved: "text-emerald-400",
    rejected: "text-red-400",
  };

  return (
    <div className="flex items-center justify-between border border-white/10 rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.05] transition">
      <div>
        <h4 className="font-medium text-white">{name}</h4>
        <p className="text-xs text-white/60">{department}</p>
      </div>
      <p className={`text-sm font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </div>
  );
}
