"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
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

export default function WhyChooseAcadeX() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls]);

  // ✅ fixed fadeLift definition
  const fadeLift = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div ref={ref} className="relative max-w-6xl mx-auto px-6 py-20">
      {/* ✨ Subtle Animated Background Glow */}
      <motion.div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3), transparent 70%)",
            "radial-gradient(circle at 80% 70%, rgba(37,99,235,0.3), transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), transparent 70%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* ✳️ Elegant Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center text-white relative"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          Why Choose AcadeX
        </span>
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={controls}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.6 } },
          }}
        />
      </motion.h2>

      {/* 🩵 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7 } },
        }}
        className="text-gray-400 text-center max-w-2xl mx-auto mb-10"
      >
        Built for the future of education — empowering schools with smart, secure, and flexible
        digital tools.
      </motion.p>

      {/* ✨ Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate={controls}
            variants={fadeLift}
            className="relative bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-700 transition-all"
          >
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🏷️ Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.7 } },
        }}
        className="flex flex-wrap justify-center gap-6 mt-10 text-gray-300 text-sm"
      >
        <div className="flex items-center gap-2 bg-white/2 px-3 py-2 rounded-lg border border-white/5">
          <GraduationCap size={16} className="text-blue-400" />
          <span>Trusted by 10+ Schools</span>
        </div>

        <div className="flex items-center gap-2 bg-white/2 px-3 py-2 rounded-lg border border-white/5">
          <BarChart3 size={16} className="text-blue-400" />
          <span>5,000+ Students</span>
        </div>

        <div className="flex items-center gap-2 bg-white/2 px-3 py-2 rounded-lg border border-white/5">
          <Layers size={16} className="text-blue-400" />
          <span>Unified Platform</span>
        </div>
      </motion.div>

      {/* 🌐 Core Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.5, duration: 0.9, ease: "easeOut" },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-gray-300 text-center"
      >
        <div>
          <ShieldCheck size={36} className="mx-auto mb-2 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Secure Data</h4>
          <p className="text-sm">Your records are protected with encryption and backups.</p>
        </div>
        <div>
          <Rocket size={36} className="mx-auto mb-2 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Lightning Fast</h4>
          <p className="text-sm">Experience seamless performance and instant responses.</p>
        </div>
        <div>
          <Cloud size={36} className="mx-auto mb-2 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Online Mode</h4>
          <p className="text-sm">Stay connected and sync across devices effortlessly.</p>
        </div>
        <div>
          <Users size={36} className="mx-auto mb-2 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">Collaboration</h4>
          <p className="text-sm">Empower teams, teachers, and admins with shared access.</p>
        </div>
      </motion.div>

      {/* 🚀 CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 0.6 } },
        }}
        className="text-center mt-14"
      >
        <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-md transition-all hover:shadow-[0_0_18px_rgba(59,130,246,0.4)]">
          Get Started with AcadeX
        </button>
      </motion.div>
    </div>
  );
}
