"use client";
import { useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
import SuperSkeleton from "@/components/SuperSkeleton";
import { motion } from "framer-motion";
import {
  Building2,
  BarChart3,
  Users,
  GraduationCap,
  LogOut,
  Settings,
  Bell,
  Key,
  FileText,
  Home,
  Menu,
  X,
  Search,
  Filter,
  Globe2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchJSON } from "@/lib/api";
import { usePathname } from "next/navigation";


type SchoolItem = {
  id: number;
  name: string;
  schoolCode: string;
  subdomain?: string;
  logo?: string | null;
  studentsCount?: number;
  adminsCount?: number;
  createdAt: string;
  status: string;
};


export default function SuperAdminSchools() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  async function loadSchools() {
    try {
      const data = await fetchJSON("/api/superadmin/schools");

      if (data.success) {
        setSchools(data.schools);
      } else {
        console.error("Error loading schools:", data);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  loadSchools();
}, []);
  // Filter schools based on search
  const filteredSchools = schools.filter((s: SchoolItem) => {
  const q = search.toLowerCase();
  const name = s.name?.toLowerCase() || "";
  const code = s.schoolCode?.toLowerCase() || "";
  return name.includes(q) || code.includes(q);
});





  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050509] via-[#0a0a12] to-[#0c0f18] text-white p-6 space-y-6">
        <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
        <SuperSkeleton count={4} />
        <SuperSkeleton type="section" count={2} />
      </div>
    );
  }

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
            {/* Sidebar Header */}
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
              <NavItem href="/superadmin/dashboard" icon={Home}>
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs mb-3">
              <p className="text-white/60">Logged in as</p>
              <p className="font-semibold text-blue-300 mt-1">SuperAdmin</p>
            </div>
            <NavItem href="/portal" icon={LogOut}>Logout</NavItem>
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
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Building2 className="text-blue-400" /> Manage Schools
              </h1>
              <p className="text-sm text-white/60">View, filter, and manage all registered schools.</p>
            </div>

            <Link
              href="/superadmin/schools/add"
              className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-600 rounded-lg font-medium text-sm hover:opacity-90"
            >
              + Add School
            </Link>
          </motion.div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 w-full sm:w-auto bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2">
              <Search className="text-white/40" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or code..."
                className="bg-transparent text-sm w-full outline-none placeholder:text-white/40"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg bg-white/[0.03] hover:bg-white/[0.1] transition text-sm">
              <Filter size={14} />
              Filter
            </button>
          </div>

          {/* Schools Grid */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSchools.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-md hover:bg-white/[0.08] transition"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-fuchsia-600/20 blur-2xl" />
                <div className="flex items-center gap-3 mb-4">
                  <Image
  src={s.logo || "/default-school.png"}
  alt={s.name}
  width={42}
  height={42}
  className="rounded-full border border-white/10"
/>

                  <div>
                    <h3 className="font-semibold text-white">{s.name}</h3>
                    <p className="text-xs text-white/50">{s.schoolCode}</p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-white/70">👥 {s.studentsCount} Students</p>
                  <p className="text-white/70">🧑‍💼 {s.adminsCount} Admins</p>
                  <p className="text-white/70">🗓️ Joined: {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span
  className={`text-xs font-medium px-2 py-1 rounded-full ${
    s.status.toLowerCase() === "active"
      ? "bg-emerald-500/20 text-emerald-400"
      : s.status.toLowerCase() === "pending"
      ? "bg-amber-500/20 text-amber-400"
      : s.status.toLowerCase() === "suspended"
      ? "bg-red-500/20 text-red-400"
      : "bg-white/20 text-white"
  }`}
>
  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
</span>

                  <Link
                    href={`/superadmin/schools/${s.id}`}
                    className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300"
                  >
                    View Details <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/40 text-sm">
                {schools.length === 0 ? "No schools found" : "No schools match your search"}
              </div>
            </div>
          )}

          <footer className="mt-8 text-center text-xs text-white/40">
            Powered by <span className="text-blue-400 font-semibold">AxWEB Technologies</span> ⚡
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Reusable Nav ---------- */
function NavItem({ href, icon: Icon, children }: any) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}