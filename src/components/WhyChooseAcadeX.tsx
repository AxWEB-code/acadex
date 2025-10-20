"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  WifiOff,
  BarChart3,
  Layers,
  ShieldCheck,
  Rocket,
  Cloud,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <WifiOff size={50} className="text-blue-400" />,
    title: "Offline Exam Mode",
    text: "Conduct secure exams even without internet access. Sync results once back online.",
  },
  {
    icon: <GraduationCap size={50} className="text-blue-400" />,
    title: "Instant Results",
    text: "Automatic result computation and analytics for teachers and students instantly.",
  },
  {
    icon: <BarChart3 size={50} className="text-blue-400" />,
    title: "Smart Performance Insights",
    text: "Track class performance and discover trends across subjects and sessions.",
  },
  {
    icon: <Layers size={50} className="text-blue-400" />,
    title: "Multi-School Management",
    text: "Handle multiple schools on one platform with centralized control and data sync.",
  },
];

// Animation controls
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeLift = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function WhyChooseAcadeX() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 py-16">
      {/* ✨ Animated Background Glow */}
      <motion.div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3), transparent 70%)",
            "radial-gradient(circle at 80% 70%, rgba(37,99,235,0.3), transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), transparent 70%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* ✳️ Elegant Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center text-white relative"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          Why Choose AcadeX
        </span>
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.h2>

      {/* 🩵 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-gray-400 text-center max-w-2xl mx-auto mb-10"
      >
        Built for the future of education — empowering schools with smart, secure, and flexible
        digital tools.
      </motion.p>

      {/* ✨ Feature Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={fadeLift}
            className="relative bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🏷️ Trust badges */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-wrap justify-center gap-6 mt-10 text-gray-300 text-sm"
      >
        {[
          { icon: <GraduationCap size={16} />, text: "Trusted by 50+ Schools" },
          { icon: <BarChart3 size={16} />, text: "5,000+ Students" },
          { icon: <Layers size={16} />, text: "Unified Platform" },
        ].map((badge, i) => (
          <motion.div
            key={i}
            variants={fadeLift}
            className="flex items-center gap-2 bg-white/2 px-3 py-2 rounded-lg border border-white/5"
          >
            <div className="text-blue-400">{badge.icon}</div>
            <span>{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* 🌐 Core Highlights */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 text-gray-300 text-center"
      >
        {[
          {
            icon: <ShieldCheck size={36} className="mx-auto mb-2 text-blue-400" />,
            title: "Secure Data",
            desc: "Your records are protected with encryption and backups.",
          },
          {
            icon: <Rocket size={36} className="mx-auto mb-2 text-blue-400" />,
            title: "Lightning Fast",
            desc: "Experience seamless performance and instant responses.",
          },
          {
            icon: <Cloud size={36} className="mx-auto mb-2 text-blue-400" />,
            title: "Online Mode",
            desc: "Stay connected and sync across devices effortlessly.",
          },
          {
            icon: <Users size={36} className="mx-auto mb-2 text-blue-400" />,
            title: "Collaboration",
            desc: "Empower teams, teachers, and admins with shared access.",
          },
        ].map((c, i) => (
          <motion.div key={i} variants={fadeLift}>
            {c.icon}
            <h4 className="text-lg font-semibold text-white">{c.title}</h4>
            <p className="text-sm">{c.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 🩵 END INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        className="mt-16 mb-4 flex justify-center"
      >
        <div className="h-[2px] w-2/3 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-full"></div>
      </motion.div>
    </div>
  );
}
