"use client";

import { useState, useEffect } from "react";
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

  // 🧩 Disable scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // restore if you leave the page
    };
  }, []);

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0c0c15] to-[#111827] text-white overflow-hidden">
      {/* ✨ Background Layers */}
      <GradientGlow />
      <ParticlesLayer />
      <FloatingIcons />

      {/* 🪶 Static Logo Above Card */}
      <div className="flex flex-col items-center mb-6 z-10 select-none">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-2">
          <motion.div
            className="absolute inset-0 bg-blue-500/25 blur-2xl rounded-full"
            animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/30">
            <img
              src="/logo.png"
              alt="AcadeX Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 🧭 Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[90%] sm:w-[420px] p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl z-10"
      >
        {!role ? (
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

/* ------------------ FLOATING ICONS ------------------ */
function FloatingIcons() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) setMouse({ x: e.clientX, y: e.clientY });
  };

  if (!mounted) return null;

  const icons = [
    { Icon: Book, size: 36, top: "10%", left: "12%", delay: 0 },
    { Icon: Wifi, size: 40, top: "25%", left: "75%", delay: 0.4 },
    { Icon: BarChart3, size: 44, top: "70%", left: "20%", delay: 0.8 },
    { Icon: Shield, size: 42, top: "85%", left: "70%", delay: 1.2 },
    { Icon: Layers, size: 38, top: "55%", left: "88%", delay: 1.0 },
    { Icon: Rocket, size: 42, top: "60%", left: "5%", delay: 0.6 },
    { Icon: Cloud, size: 38, top: "15%", left: "60%", delay: 0.7 },
    { Icon: Users, size: 38, top: "78%", left: "45%", delay: 0.3 },
    { Icon: Lock, size: 35, top: "35%", left: "40%", delay: 0.5 },
    { Icon: Globe, size: 36, top: "50%", left: "10%", delay: 0.9 },
    { Icon: Cpu, size: 36, top: "18%", left: "30%", delay: 0.4 },
    { Icon: Database, size: 38, top: "65%", left: "82%", delay: 1.1 },
    { Icon: Key, size: 34, top: "82%", left: "30%", delay: 0.3 },
    { Icon: Laptop, size: 36, top: "40%", left: "65%", delay: 0.5 },
    { Icon: ClipboardCheck, size: 36, top: "58%", left: "50%", delay: 0.8 },
    { Icon: FileText, size: 38, top: "32%", left: "20%", delay: 0.6 },
    { Icon: Server, size: 40, top: "73%", left: "60%", delay: 1.0 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" onMouseMove={handleMouseMove}>
      {icons.map(({ Icon, size, top, left, delay }, i) => {
        const w = typeof window !== "undefined" ? window.innerWidth : 0;
        const h = typeof window !== "undefined" ? window.innerHeight : 0;
        const dx = mouse.x - w * (parseFloat(left) / 100);
        const dy = mouse.y - h * (parseFloat(top) / 100);
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
              filter: `drop-shadow(0 0 ${10 + intensity * 20}px rgba(59,130,246,0.6))`,
            }}
            animate={{
              opacity: 0.1 + intensity * 0.4,
              y: [0, isMobile ? -4 : -8, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------ PARTICLES LAYER ------------------ */
function ParticlesLayer() {
  const [particles, setParticles] = useState<
    { size: number; left: string; top: string; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map(() => ({
      size: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-400/40 rounded-full blur-[2px]"
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
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
