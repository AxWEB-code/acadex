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
  Home,
  LogOut,
  Menu,
  X,
  School,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DepartmentsPage() {
  const [school, setSchool] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const stored = localStorage.getItem("acadexUser");
  if (!stored) return;

  const user = JSON.parse(stored);
  const schoolId = user.school?.id || user.admin?.schoolId;

  if (!schoolId) return;

  // Load real school info
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${schoolId}`)
    .then((res) => res.json())
    .then((schoolData) => setSchool(schoolData));

  // Load real departments
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments/school/${schoolId}`)
    .then((res) => res.json())
    .then((data) => {
      setDepartments(data);
      setLoading(false);
    });
}, []);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
      
      {/* === MOBILE OVERLAY === */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* === SIDEBAR — SAME 7 LINKS === */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 backdrop-blur-xl bg-white/[0.03] border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 grid place-items-center">
                {school?.logo ? (
                  <Image
                    src={school.logo}
                    width={40}
                    height={40}
                    alt="Logo"
                    className="object-contain"
                  />
                ) : (
                  <School size={18} className="opacity-70" />
                )}
              </div>

              <div>
                <h2 className="text-sm font-semibold">{school?.name}</h2>
                <p className="text-xs text-blue-400/70">
                  {school?.subdomain}.acadex.com
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

          {/* === SIDEBAR NAV LINKS (ALL 7) === */}
          <nav className="space-y-2 text-sm overflow-y-auto">
            <NavLink href="/portal/admin" icon={<Home size={16} />} label="Overview" />

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
          <p className="text-xs text-white/30 text-center">© 2025 AcadeX Portal</p>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 md:ml-64 px-6 py-6 relative">

        {/* MOBILE NAV TOPBAR */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm font-semibold">{school?.name}</h1>

          <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center border border-white/10">
            <Image
              src={school?.logo || "/acadex-logo.png"}
              width={24}
              height={24}
              alt="Logo"
              className="object-contain"
            />
          </div>
        </div>

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-blue-700/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Departments</h1>
            <p className="text-sm text-white/60">
              Manage all school departments and view students inside each one.
            </p>
          </div>

          <Link
            href="/portal/admin/departments/create"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Create Department
          </Link>
        </div>

        {/* === DEPARTMENTS CONTENT === */}
        {loading ? (
          <p className="text-white/60">Loading departments...</p>
        ) : departments.length === 0 ? (
          <p className="text-white/60">No departments found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dep) => (
  <motion.div
    key={dep.id}
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
  >
    <h2 className="text-lg font-semibold">{dep.name}</h2>
    <p className="text-sm text-white/60">{dep.code}</p>

    <div className="flex items-center gap-2 mt-3 text-white/70">
      <Users size={16} />
      <span>{dep.students?.length ?? 0} students</span>
    </div>

    <Link
      href={`/portal/admin/departments/${dep.id}`}
      className="text-blue-400 text-sm mt-4 inline-block hover:underline"
    >
      View Students →
    </Link>
  </motion.div>
))}

          </div>
        )}
      </main>
    </div>
  );
}

/* ===== NAV LINK COMPONENT ===== */
function NavLink({ href, icon, label }: any) {
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
