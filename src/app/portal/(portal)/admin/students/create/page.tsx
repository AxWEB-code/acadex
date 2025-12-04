"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, School, LogOut, Users, ClipboardList, GraduationCap, BarChart3, Settings, Home, Building2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CreateStudentPage() {
  const router = useRouter();

  const [school, setSchool] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    admissionNo: "",
    departmentId: "",
    level: "",
    email: "",
    phone: "",
    dob: "",
    academicYear: new Date().getFullYear(),
    semester: "",
    term: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("acadexUser");
    if (!stored) return;

    const user = JSON.parse(stored);
    const schoolId = user.school?.id || user.admin?.schoolId;

    if (!schoolId) return;

    const base = process.env.NEXT_PUBLIC_API_URL;

    // Load school info
    fetch(`${base}/api/schools/${schoolId}`)
      .then((res) => res.json())
      .then((data) => {
        setSchool(data);

        // Auto-set semester/term based on school type
        if (data.schoolType === "TERTIARY") {
          setForm((prev) => ({ ...prev, semester: "First Semester" }));
        } else {
          setForm((prev) => ({ ...prev, term: "First Term" }));
        }
      });

    // Load departments
    fetch(`${base}/api/departments/school/${schoolId}`)
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoadingDepartments(false);
      });
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const stored = localStorage.getItem("acadexUser");
    if (!stored) return;
    const user = JSON.parse(stored);
    const schoolId = user.school?.id || user.admin?.schoolId;

    const payload = {
      ...form,
      contactNumber: form.phone,
      class: form.level,
      schoolId,
      departmentId: form.departmentId,
      schoolSubdomain: school?.subdomain,
      password: form.password,
    };

    const base = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(`${base}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([payload]), // backend accepts array
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Failed to create student"}`);
      } else {
        setMessage(`✅ Student created successfully!`);
        setTimeout(() => router.push("/portal/admin/students"), 1500);
      }
    } catch (err: any) {
      setMessage("❌ Error connecting to server.");
    }

    setSubmitting(false);
  };

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
          {/* Header */}
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
                  <School size={18} />
                )}
              </div>

              <div>
                <h2 className="text-sm font-semibold">{school?.name}</h2>
                <p className="text-xs text-blue-400/70">
                  {school?.subdomain}.acadex.com
                </p>
              </div>
            </div>

            <button onClick={() => setMenuOpen(false)} className="md:hidden">
              <X size={20} />
            </button>
          </div>

          {/* NAV */}
          <nav className="space-y-2 text-sm">
            <NavLink href="/portal/admin" icon={<Home size={16} />} label="Overview" />
            <NavLink href="/portal/admin/students" icon={<Users size={16} />} label="Students" />
            <NavLink href="/portal/admin/departments" icon={<Building2 size={16} />} label="Departments" />
            <NavLink href="/portal/admin/exams" icon={<ClipboardList size={16} />} label="Exams" />
            <NavLink href="/portal/admin/results" icon={<GraduationCap size={16} />} label="Results" />
            <NavLink href="/portal/admin/analytics" icon={<BarChart3 size={16} />} label="Analytics" />
            <NavLink href="/portal/admin/settings" icon={<Settings size={16} />} label="Settings" />
          </nav>
        </div>

        {/* FOOTER */}
        <div className="mt-8">
          <button
            className="text-sm flex items-center gap-2 text-white/60 hover:text-red-400"
            onClick={() => {
              localStorage.removeItem("acadexUser");
              router.push("/portal");
            }}
          >
            <LogOut size={16} /> Logout
          </button>
          <p className="text-xs text-white/30 mt-2 text-center">© 2025 AcadeX</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 px-6 py-6 relative">

        {/* TOPBAR - MOBILE */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm">{school?.name}</h1>

          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 grid place-items-center">
            <Image
              src={school?.logo || "/acadex-logo.png"}
              width={24}
              height={24}
              alt="Logo"
            />
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Plus size={22} /> Create Student
          </h1>
          <p className="text-sm text-white/60">
            Add a new student to your school database.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-2 bg-white/[0.04] border border-white/10 rounded-2xl p-6"
        >
          <Input label="First Name" name="firstName" onChange={handleChange} required />
          <Input label="Last Name" name="lastName" onChange={handleChange} required />

          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            required
          />

          <Input
            label="Admission Number"
            name="admissionNo"
            onChange={handleChange}
            placeholder="Enter manually"
            required
          />

          <Select
            label="Department"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            loading={loadingDepartments}
            options={departments.map((d) => ({ label: d.name, value: d.id }))}
            required
          />

          <Input label="Level / Class" name="level" onChange={handleChange} />

          <Input label="Email" name="email" type="email" onChange={handleChange} required />
          <Input label="Phone" name="phone" onChange={handleChange} />

          <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} />

          <Input
            label="Academic Year"
            name="academicYear"
            type="number"
            value={form.academicYear}
            onChange={handleChange}
          />

          {school?.schoolType === "TERTIARY" ? (
            <Input
              label="Semester"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
            />
          ) : (
            <Input
              label="Term"
              name="term"
              value={form.term}
              onChange={handleChange}
              required
            />
          )}

          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="col-span-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium"
          >
            {submitting ? "Creating..." : "Create Student"}
          </button>

          {message && (
            <p className="col-span-full text-sm mt-2 text-center">
              {message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, name, type = "text", value, onChange, required, placeholder, accept }: any) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="text-white/70">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        accept={accept}
        onChange={onChange}
        className="p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

/* SELECT COMPONENT */
function Select({ label, name, value, onChange, options = [], loading, required }: any) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="text-white/70">{label}</label>
      <select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="p-2 rounded-lg bg-white/10 border border-white/20 text-white"
      >
        <option value="">{loading ? "Loading..." : "Select"}</option>
        {Array.isArray(options) &&
          options.map((opt: any, i: number) => (
            <option key={i} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
      </select>
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
      {label}
    </Link>
  );
}
