"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  School,
  ArrowLeft,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DepartmentStudentsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const departmentId = params?.id as string | undefined;

  const [school, setSchool] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [department, setDepartment] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!departmentId) return;

    // 🧠 Load logged-in school info (for sidebar/header)
    const stored = localStorage.getItem("acadexUser");
    if (!stored) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const user = JSON.parse(stored);
    const schoolData =
      user.school || {
        name: "Unknown School",
        logo: "/acadex-logo.png",
        subdomain: "unknown",
      };

    setSchool(schoolData);

    // 🧠 Fetch department + its students
    const loadDepartment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/departments/${departmentId}`
        );

        if (!res.ok) {
          throw new Error("Failed to load department");
        }

        const data = await res.json();
        setDepartment(data);
        setStudents(data.students || []);
      } catch (err: any) {
        console.error("❌ Error loading department:", err);
        setError(err.message || "Failed to load department");
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [departmentId]);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => 
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.admissionNo?.toLowerCase().includes(term) ||
      student.rollNumber?.toLowerCase().includes(term) ||
      (student.level || student.class || "").toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------------- Skeleton / Error ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
        <main className="flex-1 px-6 py-8 md:ml-64 space-y-4">
          <div className="h-8 w-40 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse" />
          <div className="mt-6 h-40 w-full bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
        </main>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">Unable to load department</p>
          <p className="text-sm text-white/60">{error || "Unknown error"}</p>
          <button
            onClick={() => router.push("/portal/admin/departments")}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
          >
            ← Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Actual Page ---------------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
      {/* === MOBILE OVERLAY === */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* === SIDEBAR === */}
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

          {/* Sidebar Nav */}
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
      <main className="flex-1 md:ml-64 px-4 sm:px-6 py-6 relative">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 -z-10">
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

        {/* BREADCRUMB + BACK */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Link href="/portal/admin/departments" className="hover:text-white">
              Departments
            </Link>
            <span>/</span>
            <span className="text-white/80">{department.name}</span>
          </div>

          <button
            onClick={() => router.push("/portal/admin/departments")}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {department.name}{" "}
              {department.code && (
                <span className="text-white/60 text-base">({department.code})</span>
              )}
            </h1>
            <p className="text-sm text-white/60">
              {students.length} student{students.length === 1 ? "" : "s"} in this department.
            </p>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search students by name, email, admission no, roll number..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/20 flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
          
          {/* Search results info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-white/60">
              Found {filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'} matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* STUDENTS CARD LIST WITH PAGINATION */}
        {currentStudents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center text-white/60 text-sm">
            {searchTerm ? 'No students found matching your search.' : 'No students found in this department yet.'}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.04] text-white/70">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Admission No</th>
                        <th className="px-4 py-3 text-left">Roll Number</th>
                        <th className="px-4 py-3 text-left">Level / Class</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.map((stu, idx) => (
                        <tr
                          key={stu.id}
                          className={`border-t border-white/5 ${
                            idx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-white/10 grid place-items-center text-[10px]">
                                {stu.firstName?.[0]}
                                {stu.lastName?.[0]}
                              </div>
                              <div className="min-w-[120px]">
                                <p className="font-medium text-white">
                                  {stu.firstName} {stu.lastName}
                                </p>
                                <p className="text-[11px] text-white/50 truncate">{stu.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white/80 min-w-[100px]">
                            {stu.admissionNo || "-"}
                          </td>
                          <td className="px-4 py-3 text-white/80 min-w-[90px]">
                            {stu.rollNumber || "-"}
                          </td>
                          <td className="px-4 py-3 text-white/70 min-w-[100px]">
                            {stu.level || stu.class || "-"}
                          </td>
                          <td className="px-4 py-3 min-w-[90px]">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                stu.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-200 border border-amber-500/30"
                              }`}
                            >
                              {stu.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Card View (shown on mobile) */}
            <div className="md:hidden space-y-3">
              {currentStudents.map((stu) => (
                <div
                  key={stu.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                >
                  {/* Header with name and status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center text-sm">
                        {stu.firstName?.[0]}
                        {stu.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {stu.firstName} {stu.lastName}
                        </p>
                        <p className="text-sm text-white/50">{stu.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        stu.status === "active"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-200 border border-amber-500/30"
                      }`}
                    >
                      {stu.status || "pending"}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/60 text-xs">Admission No</p>
                      <p className="text-white/90">{stu.admissionNo || "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Roll Number</p>
                      <p className="text-white/90">{stu.rollNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Level / Class</p>
                      <p className="text-white/90">{stu.level || stu.class || "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
                <div className="text-sm text-white/60">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border border-blue-500"
                              : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-white/30">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`w-8 h-8 rounded-lg text-sm border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
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