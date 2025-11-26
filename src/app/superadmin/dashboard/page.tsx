"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import SuperSkeleton from "@/components/SuperSkeleton";
import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Users,
  BarChart3,
  LogOut,
  Settings,
  Bell,
  Key,
  FileText,
  Home,
  Menu,
  X,
  Server,
  Activity,
  ShieldCheck,
  Cloud,
  Globe2,
  ChevronDown,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* Recharts */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,

} from "recharts";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050509] via-[#0a0a12] to-[#0c0f18] text-white p-6 space-y-6">
        <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
        <SuperSkeleton count={4} />
        <SuperSkeleton type="section" count={2} />
        <SuperSkeleton type="table" count={3} />
      </div>
    );
  }

  /* ---------- Mock Data ---------- */
type StatCardType = {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  trend?: string;
  trendType?: "positive" | "negative";
};

const statCards: StatCardType[] = [
  { 
    label: "Total Schools", 
    value: 12, 
    icon: Building2, 
    gradient: "from-blue-500 to-cyan-600",
    trend: "+4.8%",
    trendType: "positive"
  },
  { 
    label: "Total Students", 
    value: 5420, 
    icon: Users, 
    gradient: "from-purple-500 to-fuchsia-600",
    trend: "+12.3%",
    trendType: "positive"
  },
  { 
    label: "Total Admins", 
    value: 73, 
    icon: GraduationCap, 
    gradient: "from-emerald-500 to-teal-600",
    trend: "+2.1%",
    trendType: "positive"
  },
  { 
    label: "Active Exams", 
    value: 18, 
    icon: BarChart3, 
    gradient: "from-amber-400 to-orange-500",
    trend: "-1.2%",
    trendType: "negative"
  },
];

  const quickActions = [
    { title: "Add School", icon: Building2 },
    { title: "Broadcast Notice", icon: Cloud },
    { title: "Approve Requests", icon: ShieldCheck },
    { title: "View Reports", icon: FileText },
  ];

  const actions = [
    {
      title: "Pending School Approvals",
      description: "Review and approve newly registered institutions.",
      gradient: "from-blue-500 to-indigo-600",
      icon: Building2,
      href: "/superadmin/schools",
    },
    {
      title: "Manage Access Keys",
      description: "Generate supervisor, sync, and resit authorization keys.",
      gradient: "from-emerald-500 to-teal-500",
      icon: Key,
      href: "/superadmin/keys",
    },
    {
      title: "View Activity Logs",
      description: "Inspect actions and changes made by schools or admins.",
      gradient: "from-fuchsia-500 to-pink-600",
      icon: FileText,
      href: "/superadmin/logs",
    },
    {
      title: "Global Platform Settings",
      description: "Branding, maintenance, and API configurations.",
      gradient: "from-amber-400 to-orange-600",
      icon: Settings,
      href: "/superadmin/settings",
    },
  ];

  const growthSeries = [
    { m: "Jan", students: 260, schools: 2 },
    { m: "Feb", students: 480, schools: 3 },
    { m: "Mar", students: 730, schools: 5 },
    { m: "Apr", students: 1020, schools: 7 },
    { m: "May", students: 1500, schools: 8 },
    { m: "Jun", students: 2100, schools: 9 },
    { m: "Jul", students: 2890, schools: 10 },
    { m: "Aug", students: 3600, schools: 11 },
    { m: "Sep", students: 4200, schools: 11 },
    { m: "Oct", students: 5010, schools: 12 },
    { m: "Nov", students: 5420, schools: 12 },
  ];

  const examTypeDist = [
    { name: "Objective", value: 58 },
    { name: "Theory", value: 27 },
    { name: "Practical", value: 15 },
  ];

  const topSchools = [
    { name: "Ezeala College of Nursing", students: 920, exams: 14, status: "active" },
    { name: "Greenfield College", students: 740, exams: 10, status: "active" },
    { name: "TechVille CBT Center", students: 410, exams: 6, status: "suspended" },
    { name: "Royal Polytechnic", students: 620, exams: 8, status: "active" },
    { name: "Queens High School", students: 330, exams: 4, status: "active" },
  ];

  const systemStatus = [
    { label: "API Uptime", value: 99.97, color: "from-emerald-400 to-teal-500" },
    { label: "Queue Health", value: 98.4, color: "from-blue-400 to-indigo-500" },
    { label: "DB Replication", value: 99.9, color: "from-fuchsia-400 to-violet-500" },
  ];

  const recentActivities = [
    { msg: "Approved new school registration: Greenfield College", time: "3m ago" },
    { msg: "Generated 50 result access codes for ECN Nursing School", time: "1h ago" },
    { msg: "Suspended school 'TechVille CBT Center'", time: "5h ago" },
    { msg: "Updated global maintenance mode settings", time: "1d ago" },
    { msg: "Created admin for Royal Polytechnic", time: "2d ago" },
    { msg: "Broadcast: Planned maintenance on Friday", time: "3d ago" },
  ];

  const COLORS = ["#60A5FA", "#34D399", "#F59E0B", "#A78BFA", "#F472B6"];

  return (
    <FadeIn>
      <div className="min-h-screen flex bg-gradient-to-b from-[#050509] via-[#0a0a12] to-[#0c0f18] text-white overflow-hidden">
        {/* Glow */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-blue-700/15 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-fuchsia-700/15 blur-[140px]" />
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-white/10 bg-white/[0.03] flex flex-col justify-between transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
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
                  className="rounded-full border border-white/20"
                />
                <div>
                  <h2 className="text-sm font-semibold leading-tight">AcadeX Console</h2>
                  <p className="text-[11px] text-blue-400/70">SuperAdmin Access</p>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="md:hidden text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="px-3 py-4 text-sm space-y-1">
              <NavItem href="/superadmin/dashboard" icon={Home} active>
                Overview
              </NavItem>
              <NavItem href="/superadmin/schools" icon={Building2}>
                Schools
              </NavItem>
              <NavItem href="/superadmin/exams" icon={BookOpen}>Exams</NavItem>
              <NavItem href="/superadmin/admins" icon={Users}>
                Admin Accounts
              </NavItem>
              <NavItem href="/superadmin/logs" icon={FileText}>
                Logs & Activities
              </NavItem>
              <NavItem href="/superadmin/keys" icon={Key}>
                Access Keys
              </NavItem>
              <NavItem href="/superadmin/billing" icon={BarChart3}>
                Billing & Plans
              </NavItem>
              <NavItem href="/superadmin/settings" icon={Settings}>
                Platform Settings
              </NavItem>
              <NavItem href="/superadmin/notifications" icon={Bell}>
                Notifications
              </NavItem>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs mb-3">
              <p className="text-white/60">Logged in as</p>
              <p className="font-semibold text-blue-300 mt-1">SuperAdmin</p>
            </div>
            <NavItem href="/portal" icon={LogOut}>
              Logout
            </NavItem>
            <p className="text-xs text-white/30 text-center mt-3">© 2025 AcadeX Console</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 p-6 space-y-8">
          {/* Mobile topbar */}
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
              width={28}
              height={28}
              className="rounded-full border border-white/20"
            />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1420] via-[#0b0e18] to-[#0a0c14] p-6 shadow-2xl"
          >
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, SuperAdmin 👑</h1>
              <p className="text-sm text-white/60">Here's a glossy snapshot of the entire platform.</p>
            </div>
            
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Bell className="text-blue-400/70" size={22} />
                <ChevronDown size={16} className="text-white/50" />
              </button>
              
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md p-4 text-sm shadow-lg z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-white">Notifications</p>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">3 new</span>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 3).map((a, i) => (
                      <div key={i} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <p className="text-white/80 text-sm">{a.msg}</p>
                        <p className="text-[11px] text-white/50 mt-1">{a.time}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-center text-xs text-blue-400 hover:text-blue-300 pt-2 border-t border-white/10">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* System Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 flex items-center gap-3 text-sm text-white/70"
          >
            <Activity size={16} className="text-green-400 animate-pulse" /> 
            <span>All systems operational</span>
            <span className="text-white/40">•</span>
            <span>API: 99.97% uptime</span>
            <span className="text-white/40">•</span>
            <span>DB latency: 28 ms</span>
          </motion.div>

          {/* Quick Actions */}
          <motion.section 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {quickActions.map((action, i) => (
              <button 
                key={i}
                className="flex items-center justify-center gap-2 border border-white/10 bg-white/[0.05] rounded-xl p-4 hover:bg-white/[0.1] transition-all duration-200 hover:scale-[1.02]"
              >
                <action.icon className="size-4 text-blue-400" /> 
                <span className="text-sm font-medium">{action.title}</span>
              </button>
            ))}
          </motion.section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </section>

          {/* Charts Row */}
          <section className="grid xl:grid-cols-3 gap-6">
            {/* Growth (Area) */}
            <Card title="User Growth (YTD)" subtitle="Students & Schools per month" icon={<Activity size={16} />}>
              <ChartGlossyBackground />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthSeries} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gradSchools" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#34D399" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10, 12, 20, .85)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "#9ca3af" }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#60A5FA" strokeWidth={2} fill="url(#gradStudents)" />
                    <Area type="monotone" dataKey="schools" stroke="#34D399" strokeWidth={2} fill="url(#gradSchools)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Exams (Bar/Line overlay) */}
            <Card title="Exam Activity" subtitle="Live vs Closed (last 8 weeks)" icon={<BarChart3 size={16} />}>
              <ChartGlossyBackground />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarLineCombo />
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Exam Type Distribution (Pie) */}
            <Card title="Exam Type Distribution" subtitle="Current Active Exams" icon={<ShieldCheck size={16} />}>
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((c, idx) => (
                        <radialGradient id={`rad${idx}`} key={idx}>
                          <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                          <stop offset="100%" stopColor={c} stopOpacity={0.25} />
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie
                      data={examTypeDist}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {examTypeDist.map((_, i) => (
                        <Cell key={i} fill={`url(#rad${i})`} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10, 12, 20, .85)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "#9ca3af" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* Compact widgets row */}
          <section className="grid xl:grid-cols-3 gap-6">
            {/* System Health (Radial bars) */}
            <Card title="System Health" subtitle="Live status checks" icon={<Server size={16} />}>
              <div className="grid grid-cols-3 gap-4">
                {systemStatus.map((s, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-28 h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="70%"
                          outerRadius="100%"
                          data={[{ name: s.label, uv: s.value }]}
                          startAngle={90}
                          endAngle={90 + (s.value / 100) * 360}
                        >
                          <RadialBar
                            dataKey="uv"
                            cornerRadius={8}
                            fill={`url(#rb-${i})`}
                            background
                          />
                          <defs>
                            <linearGradient id={`rb-${i}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-white/70 mt-2 text-center">{s.label}</p>
                    <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                      {s.value}%
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Schools mini table */}
            <Card title="Top Schools" subtitle="By active students" icon={<Globe2 size={16} />}>
              <div className="space-y-2">
                {topSchools.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center text-xs">
                        {sc.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sc.name}</p>
                        <p className="text-xs text-white/50">{sc.exams} exams • {sc.students} students</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        sc.status === "active" ? "text-emerald-400" : "text-amber-300"
                      }`}
                    >
                      {sc.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compact Recent Activities (grid) */}
            <Card title="Recent Activities" subtitle="Latest actions across the platform" icon={<Cloud size={16} />}>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentActivities.map((a, i) => (
                  <div
                    key={i}
                    className="border border-white/10 bg-white/[0.03] rounded-xl p-3 text-sm hover:bg-white/[0.06] transition"
                  >
                    <p className="text-white/80">{a.msg}</p>
                    <p className="text-[11px] text-white/50 mt-1">{a.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Quick actions */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {actions.map((a, i) => (
              <ActionCard key={i} {...a} />
            ))}
          </section>

          <footer className="mt-8 text-center text-xs text-white/40">
            Powered by <span className="text-blue-400 font-semibold">AxWEB Technologies</span> ⚡
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Reusable UI ---------- */

function NavItem({
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
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl"
    >
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-2xl bg-gradient-to-br from-white/20 to-white/0 opacity-20 blur-xl" />
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            {icon} {title}
          </h3>
          {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ChartGlossyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 blur-2xl" />
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-violet-600/20 blur-2xl" />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
  trendType,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
  trend?: string;
  trendType?: "positive" | "negative";
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-md"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-white/60">{label}</p>
          <h3 className="text-2xl font-bold mt-1 flex items-center gap-2">
            {value}
            {trend && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-xs px-2 py-[2px] rounded-full ${
                  trendType === "positive" 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {trend}
              </motion.span>
            )}
          </h3>
        </div>
        <div className={`h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
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
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg h-[140px]"
      >
        <div className={`absolute -right-8 -top-10 h-28 w-28 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
            <Icon className="size-5" />
          </div>
          <div>
            <h4 className={`text-base font-semibold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
              {title}
            </h4>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ---------- Small Combo Chart ---------- */
function BarLineCombo() {
  const data = [
    { w: "Wk1", live: 6, closed: 2 },
    { w: "Wk2", live: 5, closed: 3 },
    { w: "Wk3", live: 7, closed: 4 },
    { w: "Wk4", live: 9, closed: 5 },
    { w: "Wk5", live: 11, closed: 6 },
    { w: "Wk6", live: 10, closed: 7 },
    { w: "Wk7", live: 12, closed: 9 },
    { w: "Wk8", live: 14, closed: 10 },
  ];
  return (
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="barLive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id="lineClosed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
      <XAxis dataKey="w" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
      <Tooltip
        contentStyle={{
          background: "rgba(10, 12, 20, .85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
        labelStyle={{ color: "#9ca3af" }}
      />
      <Bar dataKey="live" fill="url(#barLive)" radius={[8, 8, 4, 4]} />
      <LineChart data={data}>
        <Line type="monotone" dataKey="closed" stroke="url(#lineClosed)" strokeWidth={2.5} dot={false} />
      </LineChart>
    </BarChart>
  );
}