"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  UserPlus,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  Mail,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { fetchJSON } from "@/lib/api";

export default function PortalLoginPage() {
  const [school, setSchool] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [step, setStep] = useState(1); // form tab
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
    dob: "",
    admissionNo: "",
    department: "",
    level: "",
    class: "",
    semester: "",
    term: "",
    academicYear: "",
    contactNumber: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("selectedSchool");
    if (stored) {
      const s = JSON.parse(stored);
      setSchool(s);
      loadDepartments(s.id);
    } else window.location.href = "/schools";
  }, []);

  const loadDepartments = async (id: number) => {
    try {
      const res = await fetchJSON(`/api/departments?schoolId=${id}`);
      setDepartments(res || []);
    } catch {
      setDepartments([]);
    }
  };

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return setMessage("Please fill in all fields.");

    setLoading(true);
    setMessage("");

    try {
      const endpoint = isAdmin
        ? "/api/auth/admin/login"
        : "/api/auth/student/login";

      const res = await fetchJSON(endpoint, {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          schoolSubdomain: school.subdomain,
        }),
      });

      if (res.token) {
        localStorage.setItem("acadexUser", JSON.stringify(res));
        window.location.href = isAdmin
          ? "/portal/admin/dashboard"
          : "/portal/student/dashboard";
      } else {
        setMessage(res.error || "Invalid credentials.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: any) => {
    e.preventDefault();
    if (!form.email) return setMessage("Enter your email to reset password.");

    setLoading(true);
    setMessage("");

    try {
      await fetchJSON("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          schoolSubdomain: school.subdomain,
        }),
      });
      setMessage("📧 Password reset instructions sent to your email.");
    } catch {
      setMessage("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetchJSON("/api/students/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          schoolSubdomain: school.subdomain,
        }),
      });

      if (res.student) {
        setMessage("✅ Registration successful! You can now log in.");
        setIsRegister(false);
        setStep(1);
      } else {
        setMessage(res.error || "Registration failed.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!school) return null;

  // 🎨 use original blue/purple glow theme for both; admin slightly darker
  const bgColors = isAdmin
    ? "from-[#0a0a0f] via-[#0c0c14] to-[#0f1620]"
    : "from-[#0a0a0f] via-[#0c0c15] to-[#111827]";
  const accentColor = "text-blue-400";
  const btnColor = "bg-blue-500 hover:bg-blue-600";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgColors} text-white px-6 py-10 overflow-hidden relative`}
    >
      {/* 🌫 Floating breadcrumb */}
      <div className="fixed top-5 left-5 z-50">
        <Link
          href="/schools"
          className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 px-3 py-2 rounded-full text-gray-300 hover:text-blue-400 text-sm shadow-md transition"
        >
          <ArrowLeft size={16} /> Back to Schools
        </Link>
      </div>

      {/* animated glow background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <motion.div
          className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-blue-700/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-purple-700/25 rounded-full blur-3xl"
          animate={{ scale: [1.05, 1.25, 1.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* School Info */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden mb-3">
          {school.logo ? (
            <Image
              src={school.logo}
              alt={school.name}
              width={96}
              height={96}
              className="object-contain w-20 h-20"
            />
          ) : (
            <span className={`text-3xl font-bold ${accentColor}`}>
              {school.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h1 className={`text-2xl font-bold ${accentColor}`}>{school.name}</h1>
        <p className="text-gray-400 text-sm">{school.subdomain}.acadex.app</p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#181b2c]/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-white/10 shadow-lg"
      >
        {/* Tabs */}
        {!isRegister && !isForgot && (
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                !isAdmin
                  ? "bg-white/5 border border-blue-500/50 text-blue-300"
                  : "text-gray-400"
              }`}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                isAdmin
                  ? "bg-white/5 border border-blue-500/50 text-blue-300"
                  : "text-gray-400"
              }`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* LOGIN */}
          {!isRegister && !isForgot && (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={handleChange}
              />
              <div className="text-right text-xs text-gray-400">
                <span
                  onClick={() => setIsForgot(true)}
                  className="cursor-pointer text-blue-400 hover:underline"
                >
                  Forgot Password?
                </span>
              </div>

              {message && (
                <p className="text-center text-sm text-red-400">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 flex items-center justify-center gap-2 ${btnColor} text-white py-3 rounded-xl transition-all`}
              >
                <LogIn size={16} />
                {loading ? "Logging in..." : "Login"}
              </button>
              {!isAdmin && (
                <p className="text-center text-xs mt-3 text-gray-400">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsRegister(true)}
                    className="text-blue-400 cursor-pointer hover:underline"
                  >
                    Register
                  </span>
                </p>
              )}
            </motion.form>
          )}

          {/* FORGOT PASSWORD */}
          {isForgot && (
            <motion.form
              key="forgot"
              onSubmit={handleForgot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400">
                Enter your email to receive a password reset link.
              </p>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500"
              />
              {message && (
                <p className="text-center text-sm text-red-400">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all"
              >
                <Mail size={16} />
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center text-xs mt-3 text-gray-400">
                <span
                  onClick={() => setIsForgot(false)}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  Back to Login
                </span>
              </p>
            </motion.form>
          )}

          {/* REGISTER */}
          {isRegister && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Step Tabs */}
              <div className="flex justify-between mb-4 text-xs text-gray-400">
                <button
                  onClick={() => setStep(1)}
                  className={`px-3 py-1 rounded-full ${
                    step === 1
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:text-blue-300"
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`px-3 py-1 rounded-full ${
                    step === 2
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:text-blue-300"
                  }`}
                >
                  Academic
                </button>
                <button
                  onClick={() => setStep(3)}
                  className={`px-3 py-1 rounded-full ${
                    step === 3
                      ? "bg-blue-500/20 text-blue-300"
                      : "hover:text-blue-300"
                  }`}
                >
                  Account
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                {/* STEP 1 — PERSONAL INFO */}
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        className="px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        className="px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                      />
                    </div>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                    <input
                      type="text"
                      name="contactNumber"
                      placeholder="Phone / Contact Number"
                      value={form.contactNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                    <input
                      type="text"
                      name="admissionNo"
                      placeholder="Admission Number"
                      value={form.admissionNo}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                  </>
                )}

                {/* STEP 2 — ACADEMIC INFO */}
                {step === 2 && (
                  <>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                    {/* For tertiary */}
                    {school.schoolType === "TERTIARY" && (
                      <>
                        <select
                          name="level"
                          value={form.level}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                        >
                          <option value="">Select Level</option>
                          <option value="100 Level">100 Level</option>
                          <option value="200 Level">200 Level</option>
                          <option value="300 Level">300 Level</option>
                          <option value="400 Level">400 Level</option>
                        </select>
                        <select
                          name="semester"
                          value={form.semester}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                        >
                          <option value="">Select Semester</option>
                          <option value="First Semester">First Semester</option>
                          <option value="Second Semester">
                            Second Semester
                          </option>
                        </select>
                      </>
                    )}

                    {/* For high school */}
                    {school.schoolType === "HIGH_SCHOOL" && (
                      <>
                        <input
                          type="text"
                          name="class"
                          placeholder="e.g. SS1, SS2, SS3"
                          value={form.class}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                        />
                        <select
                          name="term"
                          value={form.term}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                        >
                          <option value="">Select Term</option>
                          <option value="First Term">First Term</option>
                          <option value="Second Term">Second Term</option>
                          <option value="Third Term">Third Term</option>
                        </select>
                      </>
                    )}

                    <input
                      type="text"
                      name="academicYear"
                      placeholder="Academic Year (e.g. 2024/2025)"
                      value={form.academicYear}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                  </>
                )}

                {/* STEP 3 — ACCOUNT INFO */}
                {step === 3 && (
                  <>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10"
                    />
                  </>
                )}

                {message && (
                  <p className="text-center text-sm text-red-400">{message}</p>
                )}
                <button
                  type={step < 3 ? "button" : "submit"}
                  onClick={() => (step < 3 ? setStep(step + 1) : null)}
                  className={`w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all`}
                >
                  {step < 3 ? "Next →" : "Register"}
                </button>
                {step > 1 && (
                  <p
                    onClick={() => setStep(step - 1)}
                    className="text-center text-xs text-blue-400 cursor-pointer hover:underline"
                  >
                    ← Back
                  </p>
                )}
                {step === 3 && (
                  <p className="text-center text-xs mt-3 text-gray-400">
                    Already have an account?{" "}
                    <span
                      onClick={() => setIsRegister(false)}
                      className="text-blue-400 cursor-pointer hover:underline"
                    >
                      Login
                    </span>
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="mt-10 text-xs text-gray-500">
        Powered by{" "}
        <span className="text-blue-400 font-semibold">AxWEB Technologies</span>
      </footer>
    </div>
  );
}
