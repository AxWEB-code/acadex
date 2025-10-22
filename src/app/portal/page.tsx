"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  GraduationCap,
  Book,
  Wifi,
  BarChart3,
  Layers,
  Rocket,
  Cloud,
  Users,
  Lock,
  Globe,
  Cpu,
  Database,
  Key,
  Laptop,
  ClipboardCheck,
  FileText,
  Server,
} from "lucide-react";

export default function PortalPage() {
  const [role, setRole] = useState<"admin" | "student" | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0c0c15] to-[#111827] text-white overflow-hidden">
      {/* 🌈 Gradient Glow */}
      <GradientGlow />

      {/* 🪶 Floating Icons */}
      <FloatingIcons />


      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[90%] sm:w-[420px] p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl z-10"
      >
        {!role ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-400 tracking-tight">
              Welcome to AcadeX Portal
            </h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setRole("admin")}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-600/30"
              >
                <Shield size={20} /> Admin Login
              </button>
              <button
                onClick={() => setRole("student")}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-green-600/30"
              >
                <GraduationCap size={20} /> Student Login
              </button>
            </div>
          </>
        ) : (
          <LoginForm role={role} goBack={() => setRole(null)} />
        )}
      </motion.div>
    </div>
  );
}

/* ------------------ LOGIN FORM ------------------ */
function LoginForm({ role, goBack }: { role: "admin" | "student"; goBack: () => void }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-center text-blue-400">
        {role === "admin" ? "Admin Login" : "Student Login"}
      </h3>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: connect backend later
        }}
      >
        <input
          type="text"
          placeholder={role === "admin" ? "Email or Username" : "Matric Number"}
          className="bg-[#1c1f2b] border border-blue-900/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-[#1c1f2b] border border-blue-900/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-blue-600/30"
        >
          Login
        </button>
      </form>

      <button
        onClick={goBack}
        className="text-sm text-gray-400 mt-6 hover:text-blue-300 transition"
      >
        ← Back
      </button>
    </div>
  );
}

/* ------------------ FLOATING ICONS (with entrance fade) ------------------ */
function FloatingIcons() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  const icons = [
    { Icon: Book, size: 36, top: "10%", left: "12%", delay: 0 },
    { Icon: Wifi, size: 40, top: "25%", left: "75%", delay: 1.2 },
    { Icon: BarChart3, size: 44, top: "70%", left: "20%", delay: 2 },
    { Icon: Shield, size: 42, top: "85%", left: "70%", delay: 3 },
    { Icon: Layers, size: 38, top: "55%", left: "88%", delay: 2.5 },
    { Icon: Rocket, size: 42, top: "60%", left: "5%", delay: 1.5 },
    { Icon: Cloud, size: 38, top: "15%", left: "60%", delay: 2.2 },
    { Icon: Users, size: 38, top: "78%", left: "45%", delay: 0.8 },
    { Icon: Lock, size: 35, top: "35%", left: "40%", delay: 1.8 },
    { Icon: Globe, size: 36, top: "50%", left: "10%", delay: 2.8 },
    { Icon: Cpu, size: 36, top: "18%", left: "30%", delay: 1.4 },
    { Icon: Database, size: 38, top: "65%", left: "82%", delay: 2.6 },
    { Icon: Key, size: 34, top: "82%", left: "30%", delay: 0.9 },
    { Icon: Laptop, size: 36, top: "40%", left: "65%", delay: 1.3 },
    { Icon: ClipboardCheck, size: 36, top: "58%", left: "50%", delay: 2.1 },
    { Icon: FileText, size: 38, top: "32%", left: "20%", delay: 1.9 },
    { Icon: Server, size: 40, top: "73%", left: "60%", delay: 2.7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" onMouseMove={handleMouseMove}>
      {icons.map(({ Icon, size, top, left, delay }, i) => {
        const dx = mouse.x - window.innerWidth * (parseFloat(left) / 100);
        const dy = mouse.y - window.innerHeight * (parseFloat(top) / 100);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - distance / 400);

        return (
          <motion.div
            key={i}
            className="absolute text-blue-400"
            style={{
              top,
              left,
              opacity: 0.07 + intensity * 0.4,
              filter: `drop-shadow(0 0 ${10 + intensity * 25}px rgba(59,130,246,0.6))`,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 0.1 + intensity * 0.4, scale: 1, y: [0, -8, 0] }}
            transition={{
              duration: 1.2,
              delay: delay * 0.5, // staggered fade-in
              ease: "easeOut",
              repeatDelay: 0,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------ SOFT GRADIENT GLOW ------------------ */
function GradientGlow() {
  return (
    <div className="absolute inset-0 -z-10">
      <motion.div
        className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-purple-700/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

