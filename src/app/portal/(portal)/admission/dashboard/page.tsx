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
  School,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdmissionDashboard() {
  const [school, setSchool] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Loading Admission Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c0c14] to-[#0f1620] text-white flex overflow-hidden">
      {/* Overlay when sidebar opens on mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* === Sidebar === */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-white/[0.04] backdrop-blur-xl flex flex-col justify-between transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-white/10">
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
                  <School className="opacity-80" size={18} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{school.name}</p>
                <p className="text-[11px] text-white/50">
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

          <nav className="px-3 py-4 space-y-1 text-sm overflow-y-auto">
            <SidebarItem href="#" icon={Home} active>
              Overview
            </SidebarItem>
            <SidebarItem href="#" icon={Users}>
              Applicants
            </SidebarItem>
            <SidebarItem href="#" icon={BarChart3}>
              Reports
            </SidebarItem>
            <SidebarItem href="#" icon={Settings}>
              Settings
            </SidebarItem>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs mb-3">
            <p className="text-white/60">Signed in as</p>
            <p className="mt-1 font-semibold text-blue-300">Admission Officer</p>
          </div>

          <button className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center mt-2">
            © 2025 AcadeX Admission
          </p>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 md:ml-64 px-6 py-6 space-y-8 relative overflow-x-hidden">
        {/* Mobile topbar */}
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

        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-blue-700/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222] via-[#0f1430] to-[#0a0f1f] p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold">Admission Overview</h1>
            <p className="text-sm text-white/60">
              Manage applicants and approvals for {school.stats.session}.
            </p>
          </div>
          <button className="relative text-white/70 hover:text-white transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
          </button>
        </motion.div>

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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Applicants */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">Recent Applicants</h3>
            <div className="space-y-3">
              <ApplicantRow name="Chidera Nwachukwu" department="Nursing" status="pending" />
              <ApplicantRow name="Emeka Obi" department="Midwifery" status="approved" />
              <ApplicantRow name="Peace Okwara" department="Public Health" status="rejected" />
              <ApplicantRow name="John Doe" department="Pharmacy" status="pending" />
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
              {school.activities.map((a: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  {a.type === "approved" && <CheckCircle2 className="text-green-400" size={14} />}
                  {a.type === "new" && <UserPlus className="text-blue-400" size={14} />}
                  {a.type === "rejected" && <XCircle className="text-red-400" size={14} />}
                  <span className="text-white/80 font-medium">{a.name}</span>
                  <span className="text-white/50 text-xs">• {a.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

{/* Floating Add Button (Mobile only) */}
<Link
  href="/portal/admission/new"
  className="fixed bottom-6 right-6 z-30 md:hidden rounded-full p-4 
             bg-gradient-to-br from-blue-500 to-indigo-600 
             shadow-lg shadow-blue-600/30 hover:scale-105 
             transition-transform active:scale-95"
>
  <UserPlus className="text-white" size={22} />
</Link>



        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-white/40">
          Powered by <span className="text-blue-400 font-semibold">AcadeX</span> © 2025
        </footer>
      </main>
    </div>
  );
}

/* === Components === */
function SidebarItem({
  href,
  icon: Icon,
  children,
  active,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-white/10 rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.05] transition">
      <div>
        <h4 className="font-medium text-white">{name}</h4>
        <p className="text-xs text-white/60">{department}</p>
      </div>
      <p className={`text-sm font-medium mt-1 sm:mt-0 ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </div>
  );
}
