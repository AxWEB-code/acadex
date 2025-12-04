"use client";

import { useEffect, useMemo, useState } from "react";
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
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Student = {
  id: number;
  rollNumber: string;
  admissionNo: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  email: string;
  level: string | null;
  class: string | null;
  approvalStatus: "pending" | "approved" | "rejected";
  status: "active" | "inactive" | "suspended" | string;
  department?: {
    name: string;
  } | null;
};

type School = {
  id: number;
  name: string;
  subdomain: string;
  logo?: string | null;
};

type StatusFilter = "all" | "pending" | "approved";

export default function StudentsPage() {
  const [school, setSchool] = useState<School | null>(null);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  // 🧠 Initial load: read acadexUser, set schoolId & load school info
  useEffect(() => {
    try {
      const stored = localStorage.getItem("acadexUser");
      if (!stored) return;

      const user = JSON.parse(stored);
      const sid: number | null =
        user.school?.id ?? user.admin?.schoolId ?? null;

      if (!sid) return;
      setSchoolId(sid);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${sid}`)
        .then((res) => res.json())
        .then((data) => {
          setSchool({
            id: data.id,
            name: data.name,
            subdomain: data.subdomain,
            logo: data.logo,
          });
        })
        .catch((err) => console.error("Failed loading school:", err));
    } catch (err) {
      console.error("Failed reading acadexUser:", err);
    }
  }, []);

  // 🧠 Load students when schoolId or statusFilter changes
  useEffect(() => {
    if (!schoolId) return;

    setLoading(true);

    const params = new URLSearchParams({
      schoolId: String(schoolId),
      limit: "100",
      page: "1",
    });

    if (statusFilter === "pending") params.append("approvalStatus", "pending");
    if (statusFilter === "approved") params.append("approvalStatus", "approved");

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students?${params.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed loading students:", err);
        setLoading(false);
      });
  }, [schoolId, statusFilter]);

  // 🔍 Live search (client-side) – name, roll, admission, email
  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;

    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(term)) ||
        (s.admissionNo &&
          s.admissionNo.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term))
      );
    });
  }, [students, search]);

  const pendingCount = students.filter(
    (s) => s.approvalStatus === "pending"
  ).length;

  /* === MAIN UI === */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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
                <h2 className="text-sm font-semibold">
                  {school?.name || "Loading..."}
                </h2>
                <p className="text-xs text-blue-400/70">
                  {school?.subdomain
                    ? `${school.subdomain}.acadex.com`
                    : "—"}
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

          {/* NAV LINKS */}
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

        {/* FOOTER */}
        <div className="space-y-3 mt-8">
          <button className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center">
            © 2025 AcadeX Portal
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 px-6 py-6 relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-blue-700/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* MOBILE TOPBAR */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm font-semibold">
            {school?.name || "Students"}
          </h1>

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

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Users size={22} className="text-blue-400" />
              Students
            </h1>
            <p className="text-sm text-white/60">
              View, search, and manage all students in this school.
            </p>
          </div>

          <Link
            href="/portal/admin/students/create"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Create Student
          </Link>
        </div>

        {/* FILTER BAR */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, roll number, admission number, or email..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2 justify-end">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
              <Filter size={14} />
              <span>Filter by status</span>
            </div>
            <StatusChip
              label="All"
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              icon={<Users size={14} />}
            />
            <StatusChip
              label={`Pending (${pendingCount})`}
              active={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
              icon={<Clock3 size={14} />}
              tone="amber"
            />
            <StatusChip
              label="Approved"
              active={statusFilter === "approved"}
              onClick={() => setStatusFilter("approved")}
              icon={<CheckCircle2 size={14} />}
              tone="green"
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-white/60 text-sm">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <div className="mt-10 text-center text-white/60 text-sm">
            <p>No students found for the current filters.</p>
            <p className="text-xs mt-1">
              Try clearing the search or changing the status filter.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/[0.04] border-b border-white/10">
                    <tr className="text-left text-xs uppercase text-white/50">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Level/Class</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, idx) => (
                      <tr
                        key={s.id}
                        className={`border-b border-white/5 ${
                          idx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <StudentAvatar
                              firstName={s.firstName}
                              lastName={s.lastName}
                              gender={s.gender}
                            />
                            <div>
                              <div className="font-medium">
                                {s.firstName} {s.lastName}
                              </div>
                              <div className="text-xs text-white/50">
                                {s.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">{s.rollNumber}</td>
                        <td className="px-4 py-3 text-xs">
                          {s.admissionNo || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {s.department?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {s.level || s.class || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StudentStatusBadge student={s} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/portal/admin/students/${s.id}`}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white"
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="grid gap-4 md:hidden">
              {filteredStudents.map((s) => (
                <motion.div
                  key={s.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <StudentAvatar
                        firstName={s.firstName}
                        lastName={s.lastName}
                        gender={s.gender}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-[11px] text-white/50">
                          {s.email}
                        </div>
                      </div>
                    </div>
                    <StudentStatusBadge student={s} compact />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/60">
                    <div>
                      <span className="text-white/40 block">Roll No</span>
                      <span className="font-mono text-xs">
                        {s.rollNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">
                        Admission No
                      </span>
                      <span className="font-mono text-xs">
                        {s.admissionNo || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Department</span>
                      <span>{s.department?.name || "—"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">
                        Level / Class
                      </span>
                      <span>{s.level || s.class || "—"}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/portal/admin/students/${s.id}`}
                      className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

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

function StatusChip({
  label,
  active,
  onClick,
  icon,
  tone = "blue",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tone?: "blue" | "amber" | "green";
}) {
  const base =
    tone === "amber"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : tone === "green"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : "border-blue-400/40 bg-blue-500/10 text-blue-200";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition ${
        active ? base : "border-white/15 bg-white/[0.03] text-white/60"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StudentAvatar({
  firstName,
  lastName,
  gender,
}: {
  firstName: string;
  lastName: string;
  gender: string | null;
}) {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  const isFemale = gender?.toLowerCase() === "female";

  return (
    <div
      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shadow-md ${
        isFemale
          ? "bg-gradient-to-br from-pink-500 to-rose-500"
          : "bg-gradient-to-br from-blue-500 to-indigo-500"
      }`}
    >
      {initials || "ST"}
    </div>
  );
}

function StudentStatusBadge({
  student,
  compact = false,
}: {
  student: Student;
  compact?: boolean;
}) {
  const { approvalStatus, status } = student;

  let label = "Active";
  let color =
    "bg-emerald-500/10 text-emerald-300 border border-emerald-400/40";
  let Icon = CheckCircle2;

  if (approvalStatus === "pending") {
    label = "Pending Approval";
    color = "bg-amber-500/10 text-amber-300 border border-amber-400/40";
    Icon = Clock3;
  } else if (
    approvalStatus === "rejected" ||
    status === "inactive" ||
    status === "suspended"
  ) {
    label = "Suspended";
    color = "bg-rose-500/10 text-rose-300 border border-rose-400/40";
    Icon = XCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 ${
        compact ? "py-0.5 text-[10px]" : "py-1 text-xs"
      } ${color}`}
    >
      <Icon size={compact ? 11 : 12} />
      <span>{label}</span>
    </span>
  );
}
