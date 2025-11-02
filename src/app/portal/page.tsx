"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  Mail,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { fetchJSON } from "@/lib/api";
import { API_BASE } from "@/lib/config";


// Define proper types to replace 'any'
interface School {
  id: number;
  name: string;
  subdomain: string;
  logo?: string;
  schoolType: string;
}

interface Department {
  id: number;
  name: string;
}

// ✅ ADDED: Proper type for login response
interface LoginResponse {
  token?: string;
  error?: string;
  [key: string]: unknown;
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-sm font-medium shadow-lg z-[9999] backdrop-blur-md
        ${type === "success"
          ? "bg-green-500/90 text-white"
          : "bg-red-500/90 text-white"}`}
    >
      {message}
    </motion.div>
  );
}

export default function PortalLoginPage() {
  const [school, setSchool] = useState<School | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [showSchoolCodeModal, setShowSchoolCodeModal] = useState(false);
  const [schoolCode, setSchoolCode] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [shake, setShake] = useState(false);

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
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ✅ ADDED MISSING FUNCTION
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const stored = localStorage.getItem("selectedSchool");
    if (stored) {
      const s = JSON.parse(stored);
      setSchool(s);
      if (s.schoolType === "TERTIARY") {
        loadDepartments(s.id);
      }
    } else {
      window.location.href = "/select-school";
    }
  }, []);

  // Show school code modal when registration is clicked
  useEffect(() => {
    if (isRegister && !isAdmin) {
      setShowSchoolCodeModal(true);
    }
  }, [isRegister, isAdmin]);

  const loadDepartments = async (id: number) => {
    try {
      const res = await fetchJSON(`/api/departments?schoolId=${id}`);
      setDepartments(res || []);
    } catch {
      setDepartments([]);
    }
  };

  const verifySchoolCode = async (code: string): Promise<boolean> => {
    try {
      console.log("🔍 [FRONTEND DEBUG] Starting verification...", {
        enteredCode: code,
        schoolId: school?.id,
        schoolName: school?.name,
        schoolSubdomain: school?.subdomain
      });

      const response = await fetchJSON("/api/schools/verify-code", {
        method: "POST",
        body: JSON.stringify({
          schoolCode: code.trim().toUpperCase(),
          schoolId: school?.id,
        }),
      });

      console.log("🔍 [FRONTEND DEBUG] Full API response:", response);
      
      if (response.isValid === true) {
        console.log("✅ [FRONTEND DEBUG] Code is VALID!");
        return true;
      } else {
        console.log("❌ [FRONTEND DEBUG] Code is INVALID according to backend");
        console.log("🔍 [FRONTEND DEBUG] Response details:", response);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("❌ [FRONTEND DEBUG] Request failed:", errorMessage);
      return false;
    }
  };

  const handleSchoolCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolCode.trim()) {
      setToast({ msg: "Please enter your school code", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setModalLoading(true);
    setMessage("");

    try {
      const isValid = await verifySchoolCode(schoolCode);
      
      if (isValid) {
        setShowSchoolCodeModal(false);
        setMessage("");
        // School code verified, continue with registration
      } else {
        setToast({ msg: "❌ Invalid school code. Please check with your institution and try again.", type: "error" });
        setTimeout(() => setToast(null), 3000);
        // Keep the modal open for retry
      }
    } catch {
      setToast({ msg: "❌ Verification failed. Please try again.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ FIXED handleLogin with proper typing
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setToast({ msg: "Please fill in all fields.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const endpoint = isAdmin
  ? `${API_BASE}/api/auth/admin/login`
  : `${API_BASE}/api/students/login`;


      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          schoolSubdomain: school?.subdomain,
        }),
      });

      // ✅ FIXED: Proper typing instead of 'any'
      let data: LoginResponse = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data.token) {
        setToast({
          msg: "✅ Login successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          localStorage.setItem("acadexUser", JSON.stringify(data));
          window.location.href = isAdmin
            ? "/portal/admin/dashboard"
            : "/portal/student/dashboard";
        }, 1500);
      } else {
        // ✅ Properly show backend error message instead of "network error"
        setShake(true);
        setToast({
          msg:
            data.error ||
            (response.status === 401
              ? "❌ Incorrect email or password."
              : "⚠️ Login failed. Please try again."),
          type: "error",
        });
        setTimeout(() => {
          setShake(false);
          setToast(null);
        }, 3500);
      }
    } catch {
      // ✅ FIXED: Removed unused 'error' parameter
      // Only runs if backend cannot be reached at all
      setShake(true);
      setToast({
        msg: "🚫 Server unreachable. Check your internet or try again later.",
        type: "error",
      });
      setTimeout(() => {
        setShake(false);
        setToast(null);
      }, 3500);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      setToast({ msg: "Enter your email to reset password.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          schoolSubdomain: school?.subdomain,
        }),
      });
      setToast({ msg: "📧 Password reset instructions sent to your email.", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ msg: "Failed to send reset link.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate all critical fields before sending
    if (!form.firstName || !form.lastName) {
      setToast({ msg: "Please fill in your first and last name.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!form.email || !form.password) {
      setToast({ msg: "Please enter your email and password.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!school?.subdomain) {
      setToast({ msg: "School information is missing. Please reselect your school.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("📤 [FRONTEND] Sending registration data:", {
        ...form,
        schoolSubdomain: school?.subdomain,
        password: "***" // Don't log actual password
      });

      const response = await fetch(`${API_BASE}/api/students/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...form,
    schoolSubdomain: school?.subdomain,
  }),
});

const res = await response.json(); // ✅ Parse to JSON first

console.log("📥 [FRONTEND] Registration response:", res);

if (res.student) {

        // ✅ FIXED: Show approval pending message
        setToast({
          msg: "✅ Registration successful! Your account is pending approval by the school admin. You'll receive an email notification once it's approved.",
          type: "success",
        });
        setTimeout(() => setToast(null), 4000);
        
        // ✅ FIXED: Reset form properly
        setForm({
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
        setIsRegister(false);
        setStep(1);
      } else {
        // ✅ FIXED: Better error handling for duplicates
        if (res.error?.includes("email") || res.error?.includes("Email")) {
          setToast({ msg: "❌ This email is already registered. Please use a different email or try logging in.", type: "error" });
        } else if (res.error?.includes("admission") || res.error?.includes("Admission")) {
          setToast({ msg: "❌ This admission number is already registered. Please check your admission number or contact your school.", type: "error" });
        } else {
          setToast({ msg: res.error || "Registration failed.", type: "error" });
        }
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error("❌ [FRONTEND] Registration error:", error);
      setToast({ msg: "Network error. Please try again.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!school) return null;

  const bgColors = isAdmin
    ? "from-[#0a0a0f] via-[#0c0c14] to-[#0f1620]"
    : "from-[#0a0a0f] via-[#0c0c15] to-[#111827]";
  const accentColor = "text-blue-400";
  const btnColor = "bg-blue-500 hover:bg-blue-600";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgColors} text-white px-6 py-10 overflow-hidden relative`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.msg} type={toast.type} />
        )}
      </AnimatePresence>

      {/* School Code Modal - FIXED: Better error display */}
      <AnimatePresence>
        {showSchoolCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSchoolCodeModal(false);
              setIsRegister(false);
              setSchoolCode("");
              setMessage("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#181b2c] border border-white/10 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  School Verification
                </h3>
                <button
                  onClick={() => {
                    setShowSchoolCodeModal(false);
                    setIsRegister(false);
                    setSchoolCode("");
                    setMessage("");
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Please enter your school code to continue with registration. 
                This ensures you&apos;re registering for the correct school.
              </p>

              <form onSubmit={handleSchoolCodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="SCH-****-****"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-center font-mono tracking-wider"
                    disabled={modalLoading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Your school code should be provided by your institution
                  </p>
                </div>

                {/* ✅ FIXED: Better error message positioning */}
                {message && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`text-center text-sm p-3 rounded-lg ${
                      message.includes("❌") 
                        ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                        : "bg-green-500/20 text-green-300 border border-green-500/30"
                    }`}
                  >
                    {message}
                  </motion.p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSchoolCodeModal(false);
                      setIsRegister(false);
                      setSchoolCode("");
                      setMessage("");
                    }}
                    disabled={modalLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300 hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading || !schoolCode.trim()}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌫 Floating breadcrumb */}
      <div className="fixed top-5 left-5 z-40">
        <Link
          href="/select-school"
          className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 px-3 py-2 rounded-full text-gray-300 hover:text-blue-400 text-sm shadow-md transition"
        >
          <ArrowLeft size={16} /> Back to School
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#181b2c]/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-white/10 shadow-lg"
      >
        {/* Toggle Tabs */}
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
              animate={{
                opacity: 1,
                y: 0,
                x: shake ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 pr-10"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right text-xs text-gray-400">
                <span
                  onClick={() => setIsForgot(true)}
                  className="cursor-pointer text-blue-400 hover:underline"
                >
                  Forgot Password?
                </span>
              </div>

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
                  Don&apos;t have an account?{" "}
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

          {/* REGISTER WITH PROGRESS BAR */}
          {isRegister && !showSchoolCodeModal && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step Tabs */}
              <div className="flex justify-between mb-4 text-xs text-gray-400">
                {["Personal", "Academic", "Account"].map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i + 1)}
                    className={`px-3 py-1 rounded-full ${
                      step === i + 1
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:text-blue-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* FORM SECTIONS */}
              <form onSubmit={handleRegister} className="space-y-3">
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
                      className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-blue-500"
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

                {step === 2 && (
                  <>
                    {/* Department selection - ONLY for tertiary schools */}
                    {school.schoolType === "TERTIARY" && (
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {school.schoolType === "TERTIARY" ? (
                      <>
                        <select
                          name="level"
                          value={form.level}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Semester</option>
                          <option value="First Semester">First Semester</option>
                          <option value="Second Semester">
                            Second Semester
                          </option>
                        </select>
                      </>
                    ) : (
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
                          className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                      >
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </>
                )}

                <button
                  type={step < 3 ? "button" : "submit"}
                  onClick={() => step < 3 && setStep(step + 1)}
                  disabled={loading}
                  className={`w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all disabled:opacity-50`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : step < 3 ? (
                    "Next →"
                  ) : (
                    "Create Account"
                  )}
                </button>

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