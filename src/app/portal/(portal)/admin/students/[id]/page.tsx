"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  CalendarDays,
  Mail,
  Phone,
  IdCard,
  Shield,
  BookOpenCheck,
  Activity,
  UserCheck,
  Ban,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Department = {
  id: string;
  name: string;
};

type School = {
  id: number;
  name: string;
  subdomain: string;
  logo?: string | null;
};

type Student = {
  id: number;
  rollNumber: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  email: string;
  contactNumber: string | null;
  dob: string | null;
  academicYear: string | null;
  level: string | null;
  term: string | null;
  semester: string | null;
  class: string | null;
  status: "active" | "inactive" | "pending" | string;
  approvalStatus: "approved" | "pending" | "rejected" | string;
  school: School;
  department: Department | null;
  performance?: {
    exams?: any[];
    averageScore?: number;
  };
  avatarUrl?: string | null;
  photo?: string | null;
};

type ActionState = "idle" | "approving" | "suspending" | "activating";

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const studentId = params?.id;

  const [school, setSchool] = useState<School | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Mock exam & result data for now
  const mockExams = [
    {
      id: 1,
      name: "First Semester CBT 2025",
      course: "Anatomy 101",
      date: "2025-02-10",
      score: "78%",
      grade: "B+",
    },
    {
      id: 2,
      name: "Midterm CBT",
      course: "Physiology 102",
      date: "2025-03-02",
      score: "84%",
      grade: "A-",
    },
    {
      id: 3,
      name: "Mock Exam",
      course: "Biochemistry 103",
      date: "2025-04-15",
      score: "69%",
      grade: "C+",
    },
  ];

  const mockSummary = {
    gpa: "3.64",
    examsWritten: 12,
    bestScore: "96%",
    weakestArea: "Pharmacology",
  };

  useEffect(() => {
    if (!studentId) return;

    const stored = localStorage.getItem("acadexUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const schoolId = parsed.school?.id || parsed.admin?.schoolId;

    if (!schoolId) return;

    const base = process.env.NEXT_PUBLIC_API_URL;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${base}/api/schools/${schoolId}`).then((r) => r.json()),
      fetch(`${base}/api/students/${studentId}`).then((r) => r.json()),
    ])
      .then(([schoolData, studentData]) => {
        setSchool({
          id: schoolData.id,
          name: schoolData.name,
          subdomain: schoolData.subdomain,
          logo: schoolData.logo,
        });
        setStudent(studentData);
      })
      .catch((err) => {
        console.error("Failed loading student profile:", err);
        setError("Failed to load student profile.");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleStatusChange = async (type: "approve" | "suspend" | "activate") => {
    if (!student) return;

    let updates: Partial<Student> = {};
    let state: ActionState;

    if (type === "approve") {
      updates = { approvalStatus: "approved", status: "active" };
      state = "approving";
    } else if (type === "suspend") {
      updates = { approvalStatus: "rejected", status: "inactive" };
      state = "suspending";
    } else {
      updates = { approvalStatus: "approved", status: "active" };
      state = "activating";
    }

    try {
      setActionState(state);
      setError(null);

      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/api/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update student");
      }

      const data = await res.json();
      setStudent(data.student);
    } catch (err: any) {
      console.error("Status update error:", err);
      setError(err.message || "Failed to update student status.");
    } finally {
      setActionState("idle");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
      case "inactive":
        return "bg-red-500/10 text-red-300 border-red-500/40";
      case "pending":
        return "bg-amber-500/10 text-amber-300 border-amber-500/40";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/40";
    }
  };

  const approvalColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-emerald-300";
      case "pending":
        return "text-amber-300";
      case "rejected":
        return "text-red-300";
      default:
        return "text-slate-300";
    }
  };

  const fullName = student ? `${student.firstName} ${student.lastName}` : "";

  /* --------------- Skeleton / Loading --------------- */
  if (loading || !student || !school) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">
        {/* Sidebar skeleton */}
        <aside className="hidden md:flex flex-col justify-between w-64 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 animate-pulse">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex flex-col gap-2 w-24">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-2 w-16 bg-white/10 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              {Array(7)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-full rounded-lg bg-white/[0.05]"
                  />
                ))}
            </div>
          </div>
          <div className="h-8 w-32 bg-white/[0.05] rounded mx-auto" />
        </aside>

        {/* Main skeleton */}
        <main className="flex-1 p-6 space-y-6">
          <div className="h-7 w-48 bg-white/[0.08] rounded-lg mb-2" />
          <div className="h-4 w-64 bg-white/[0.05] rounded-lg mb-6" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-52 rounded-2xl bg-white/[0.04] border border-white/10" />
            <div className="h-52 rounded-2xl bg-white/[0.04] border border-white/10" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-64 rounded-2xl bg-white/[0.04] border border-white/10" />
            <div className="h-64 rounded-2xl bg-white/[0.04] border border-white/10" />
          </div>
        </main>
      </div>
    );
  }

  /* --------------- Actual Page --------------- */
  const avatarInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = student.photo || student.avatarUrl || "";

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
                {school.logo ? (
                  <Image
                    src={school.logo}
                    width={40}
                    height={40}
                    alt={school.name}
                    className="object-contain"
                  />
                ) : (
                  <School size={18} className="opacity-70" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{school.name}</h2>
                <p className="text-xs text-blue-400/70">
                  {school.subdomain}.acadex.com
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
          <button
            className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition"
            onClick={() => {
              localStorage.removeItem("acadexUser");
              router.push("/portal");
            }}
          >
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center">
            © 2025 AcadeX Portal
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 px-6 py-6 relative overflow-x-hidden">
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

          <h1 className="text-sm font-semibold truncate max-w-[45%]">
            {school.name}
          </h1>

          <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center border border-white/10">
            <Image
              src={school.logo || "/acadex-logo.png"}
              width={24}
              height={24}
              alt="Logo"
              className="object-contain"
            />
          </div>
        </div>

        {/* HEADER + ACTION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <button
              onClick={() => router.push("/portal/admin/students")}
              className="text-xs mb-2 text-white/50 hover:text-white flex items-center gap-1"
            >
              ← Back to students
            </button>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              Student Profile
              <span
                className={`text-[11px] px-2 py-1 rounded-full border ${statusColor(
                  student.status
                )}`}
              >
                {student.status.toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-white/60">
              View full details, exam history and manage this student&apos;s status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs flex items-center gap-1.5 hover:bg-white/10"
              onClick={() => {
                // we'll wire a real edit page later
                alert("Edit student coming soon ✨");
              }}
            >
              <Edit size={14} /> Edit
            </button>

            <button
              disabled={actionState !== "idle"}
              onClick={() => handleStatusChange("approve")}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs flex items-center gap-1.5 disabled:opacity-60"
            >
              <UserCheck size={14} />
              {actionState === "approving" ? "Approving..." : "Approve / Activate"}
            </button>

            <button
              disabled={actionState !== "idle"}
              onClick={() => handleStatusChange("suspend")}
              className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-xs flex items-center gap-1.5 disabled:opacity-60"
            >
              <Ban size={14} />
              {actionState === "suspending" ? "Suspending..." : "Suspend"}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 text-xs bg-red-500/10 border border-red-500/40 text-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* TOP SECTION – PROFILE CARD + QUICK STATS */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={fullName}
                      width={70}
                      height={70}
                      className="rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl font-semibold border border-white/30">
                      {avatarInitials}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border border-[#090d1a]" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">{fullName}</h2>
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                    <IdCard size={13} /> Roll: {student.rollNumber}
                  </p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <IdCard size={13} /> Admission No: {student.admissionNo}
                  </p>
                  <p className={`text-xs mt-1 ${approvalColor(student.approvalStatus)}`}>
                    Approval: {student.approvalStatus.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <InfoPill
                  icon={<Shield size={14} />}
                  label="Academic Year"
                  value={student.academicYear || "Not set"}
                />
                <InfoPill
                  icon={<Building2 size={14} />}
                  label="Department"
                  value={student.department?.name || "Not assigned"}
                />
                <InfoPill
                  icon={<BookOpenCheck size={14} />}
                  label="Level / Class"
                  value={student.level || student.class || "Not set"}
                />
                <InfoPill
                  icon={<CalendarDays size={14} />}
                  label="Term / Semester"
                  value={
                    student.term ||
                    student.semester ||
                    (school ? (school as any).schoolType === "TERTIARY" ? "Semester" : "Term" : "Not set")
                  }
                />
              </div>
            </div>

            {/* Contact row */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} /> {student.email}
              </span>
              {student.contactNumber && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} /> {student.contactNumber}
                </span>
              )}
              {student.dob && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />{" "}
                  {new Date(student.dob).toLocaleDateString()}
                </span>
              )}
              {student.gender && (
                <span className="inline-flex items-center gap-1.5">
                  <Users size={13} /> {student.gender}
                </span>
              )}
            </div>
          </motion.div>

          {/* Quick performance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg text-xs"
          >
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Activity size={16} /> Performance Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <SummaryStat label="GPA (mock)" value={mockSummary.gpa} />
              <SummaryStat
                label="Exams Written"
                value={mockSummary.examsWritten.toString()}
              />
              <SummaryStat label="Best Score" value={mockSummary.bestScore} />
              <SummaryStat label="Weakest Area" value={mockSummary.weakestArea} />
            </div>

            <div className="mt-3 h-24 rounded-xl bg-white/[0.04] border border-white/10 grid place-items-center text-[11px] text-white/40">
              📊 Performance chart coming soon
            </div>
          </motion.div>
        </div>

        {/* LOWER SECTION – DETAILS + HISTORY */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left – detailed info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg text-xs sm:text-sm"
          >
            <h3 className="text-sm font-semibold mb-4">
              Detailed Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wide text-white/50">
                  Personal
                </h4>
                <InfoRow label="Full Name" value={fullName} />
                <InfoRow label="Gender" value={student.gender || "Not set"} />
                <InfoRow
                  label="Date of Birth"
                  value={
                    student.dob
                      ? new Date(student.dob).toLocaleDateString()
                      : "Not set"
                  }
                />
                <InfoRow label="Email" value={student.email} />
                <InfoRow
                  label="Phone"
                  value={student.contactNumber || "Not set"}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wide text-white/50">
                  Academic
                </h4>
                <InfoRow label="Roll Number" value={student.rollNumber} />
                <InfoRow label="Admission No" value={student.admissionNo} />
                <InfoRow
                  label="Department"
                  value={student.department?.name || "Not assigned"}
                />
                <InfoRow
                  label="Level / Class"
                  value={student.level || student.class || "Not set"}
                />
                <InfoRow
                  label="Term / Semester"
                  value={student.term || student.semester || "Not set"}
                />
                <InfoRow
                  label="Academic Year"
                  value={student.academicYear || "Not set"}
                />
              </div>
            </div>
          </motion.div>

          {/* Right – Exam history (mock for now) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg text-xs"
          >
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ClipboardList size={16} /> Recent Exams (Mock)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {mockExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <p className="text-xs font-semibold">{exam.name}</p>
                  <p className="text-[11px] text-white/60">{exam.course}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
                    <span>{exam.date}</span>
                    <span className="font-semibold text-blue-300">
                      {exam.score} ({exam.grade})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-3 text-[11px] text-blue-300 hover:underline">
              View full exam & result history →
            </button>
          </motion.div>
        </div>

        <footer className="mt-10 text-center text-[11px] text-white/40">
          Powered by <span className="text-blue-400 font-semibold">AcadeX</span> ©
          2025
        </footer>
      </main>
    </div>
  );
}

/* ---------- Small helper components ---------- */

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-white/50">{label}</span>
      <span className="text-white/90 text-right">
        {value && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-white/40 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-xs text-white/90 truncate">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
      <div className="text-[10px] text-white/50">{label}</div>
      <div className="text-xs font-semibold text-white mt-0.5">{value}</div>
    </div>
  );
}

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
