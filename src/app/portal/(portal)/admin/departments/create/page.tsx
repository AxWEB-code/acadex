"use client";

import { useEffect, useState } from "react";
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
  Building2,
  Check,
  Loader2,
  Hash,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type AcadexUser = {
  school?: { id?: number; name?: string; logo?: string; subdomain?: string };
  admin?: { schoolId?: number };
};

export default function CreateDepartmentPage() {
  const router = useRouter();

  const [school, setSchool] = useState<any>(null);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    code: false,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔹 Load school + schoolId from localStorage (Option A)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("acadexUser");
      if (stored) {
        const parsed: AcadexUser = JSON.parse(stored);

        const schoolData = parsed.school || null;
        setSchool(
          schoolData || {
            name: "AcadeX School",
            logo: "/acadex-logo.png",
            subdomain: "school",
          }
        );

        const sid =
          schoolData?.id ??
          parsed.admin?.schoolId ??
          null;

        if (sid) setSchoolId(Number(sid));
      } else {
        // fallback dummy (just for UI)
        setSchool({
          name: "AcadeX School",
          logo: "/acadex-logo.png",
          subdomain: "school",
        });
      }
    } catch (err) {
      console.error("Error parsing acadexUser:", err);
      setSchool({
        name: "AcadeX School",
        logo: "/acadex-logo.png",
        subdomain: "school",
      });
    }
  }, []);

  // 🔹 Auto-hide toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // 🔹 Simple code generator from name (Computer Science → CS, CSC, etc.)
  const generateCodeFromName = (name: string) => {
    if (!name) return "";
    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      const clean = words[0].replace(/[^A-Za-z]/g, "");
      return clean.slice(0, 3).toUpperCase();
    }

    // Take first letter of each word (max 4)
    const initials = words
      .map((w) => w[0])
      .join("")
      .slice(0, 4);

    return initials.toUpperCase();
  };

  const isValid =
    form.name.trim().length > 1 && form.code.trim().length > 1 && !!schoolId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, code: true });

    if (!isValid) {
      setToast("Please fill all required fields correctly.");
      return;
    }

    if (!schoolId) {
      setToast("Missing school context. Please re-login.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          schoolId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast(data?.error || "Error creating department.");
        setLoading(false);
        return;
      }

      setToast("Department created successfully!");
      setShowSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push("/portal/admin/departments");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      // only auto-generate if code is still empty
      code: prev.code || generateCodeFromName(value),
    }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#090d1a] via-[#0b1124] to-[#070b16] text-white relative overflow-hidden">

      {/* TOAST NOTIFICATION */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-5 right-5 z-[9999] bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-lg text-sm shadow-xl"
        >
          {toast}
        </motion.div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 border border-white/20 backdrop-blur-xl px-8 py-6 rounded-2xl text-center relative overflow-hidden"
          >
            {/* Fake confetti dots */}
            <div className="absolute -top-2 left-10 w-2 h-2 bg-blue-400 rounded-full" />
            <div className="absolute top-4 right-12 w-2 h-2 bg-emerald-400 rounded-full" />
            <div className="absolute bottom-3 left-16 w-2 h-2 bg-pink-400 rounded-full" />

            <Check className="text-green-400 mx-auto mb-3" size={40} />
            <h3 className="text-xl font-semibold">Department Created</h3>
            <p className="text-white/60 mt-1 text-sm">
              Redirecting to departments...
            </p>
          </motion.div>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR — SAME 7 LINKS */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 backdrop-blur-xl bg-white/[0.03] border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/10 grid place-items-center">
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
                  {school?.subdomain || "school"}.acadex.com
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
            <NavLink href="/portal/admin/students" icon={<Users size={16} />} label="Students" />
            <NavLink href="/portal/admin/departments" icon={<Building2 size={16} />} label="Departments" />
            <NavLink href="/portal/admin/exams" icon={<ClipboardList size={16} />} label="Exams" />
            <NavLink href="/portal/admin/results" icon={<GraduationCap size={16} />} label="Results" />
            <NavLink href="/portal/admin/analytics" icon={<BarChart3 size={16} />} label="Analytics" />
            <NavLink href="/portal/admin/settings" icon={<Settings size={16} />} label="Settings" />
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 mt-8">
          <button className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition">
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 text-center">© 2025 AcadeX Portal</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 px-6 py-6 relative space-y-6">

        {/* MOBILE TOP NAV */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm font-semibold">{school?.name || "AcadeX School"}</h1>

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

        {/* BREADCRUMB */}
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-white/60 flex items-center gap-2"
        >
          <Link
            href="/portal/admin/departments"
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Departments
          </Link>
          <span>→</span>
          <span>Create</span>
        </motion.p>

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold">Create Department</h1>
          <p className="text-sm text-white/60">
            Add a new department to the school and link upcoming exams & students.
          </p>
        </motion.div>

        {/* CENTERED FORM */}
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-8 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Department Name */}
              <div>
                <label className="text-sm text-white/70">Department Name</label>

                <div className="relative mt-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 outline-none transition hover:bg-white/[0.12]"
                    placeholder="e.g. Computer Science"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  />
                </div>

                {touched.name && form.name.trim().length <= 1 && (
                  <p className="text-xs text-red-400 mt-1">
                    Department name is required.
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div>
                <label className="text-sm text-white/70">Department Code</label>

                <div className="relative mt-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 uppercase focus:border-blue-400 outline-none transition hover:bg-white/[0.12]"
                    placeholder="e.g. CSC"
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    onBlur={() => setTouched((prev) => ({ ...prev, code: true }))}
                  />
                </div>

                {touched.code && form.code.trim().length <= 1 && (
                  <p className="text-xs text-red-400 mt-1">
                    Department code is required.
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition ${
                    !isValid || loading
                      ? "bg-blue-900/50 text-white/50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Create Department"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/portal/admin/departments")}
                  className="px-4 py-3 rounded-lg border border-white/20 text-sm text-white/80 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* NAV LINK COMPONENT */
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
