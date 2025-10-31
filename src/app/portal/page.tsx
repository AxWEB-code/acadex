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
} from "lucide-react";
import Link from "next/link";
import { fetchJSON } from "@/lib/api";

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
    console.log("🔍 [FRONTEND] Sending verification request:", {
      enteredCode: code,
      schoolId: school?.id,
      schoolName: school?.name
    });

    const response = await fetchJSON("/schools/verify-code", {
      method: "POST",
      body: JSON.stringify({
        schoolCode: code.trim().toUpperCase(),
        schoolId: school?.id,
      }),
    });

    console.log("✅ [FRONTEND] Received response:", response);
    return response.isValid === true;
  } catch (error: any) {
    console.error("❌ [FRONTEND] Request failed:", error.message);
    return false;
  }
};

  const handleSchoolCodeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!schoolCode.trim()) {
    setMessage("Please enter your school code");
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
      setMessage("❌ Invalid school code. Please check with your institution and try again.");
      // Keep the modal open for retry
    }
  } catch {
    setMessage("❌ Verification failed. Please try again.");
  } finally {
    setModalLoading(false);
  }
};

  // Fixed handleChange with proper type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Fixed handler types
  const handleLogin = async (e: React.FormEvent) => {
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
          schoolSubdomain: school?.subdomain,
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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return setMessage("Enter your email to reset password.");

    setLoading(true);
    setMessage("");

    try {
      await fetchJSON("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          schoolSubdomain: school?.subdomain,
        }),
      });
      setMessage("📧 Password reset instructions sent to your email.");
    } catch {
      setMessage("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetchJSON("/api/students/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          schoolSubdomain: school?.subdomain,
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

  const bgColors = isAdmin
    ? "from-[#0a0a0f] via-[#0c0c14] to-[#0f1620]"
    : "from-[#0a0a0f] via-[#0c0c15] to-[#111827]";
  const accentColor = "text-blue-400";
  const btnColor = "bg-blue-500 hover:bg-blue-600";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgColors} text-white px-6 py-10 overflow-hidden relative`}
    >
      {/* School Code Modal */}
      <AnimatePresence>
        {showSchoolCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#181b2c] border border-white/10 rounded-2xl p-6 w-full max-w-md"
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
                    placeholder="SCH-ECNS-9466"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    disabled={modalLoading}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Your school code should be provided by your institution
                  </p>
                </div>

                {message && (
                  <p className={`text-center text-sm ${
                    message.includes("❌") ? "text-red-400" : "text-green-400"
                  }`}>
                    {message}
                  </p>
                )}

                <div className="flex gap-3">
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
          <ArrowLeft size={16} /> Back to School Selection
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
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
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
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500"
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
                  onClick={() => step < 3 && setStep(step + 1)}
                  className={`w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all`}
                >
                  {step < 3 ? "Next →" : "Register"}
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