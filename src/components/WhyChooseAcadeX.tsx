"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  WifiOff,
  BarChart3,
  Layers,
  BookOpen,
  PenLine,
  Brain,
  Lightbulb,
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

// ✳️ Floating icons (background animation)
const floatingIcons = [
  { Icon: BookOpen, x: "-35%", y: "-10%", delay: 0 },
  { Icon: PenLine, x: "40%", y: "0%", delay: 1 },
  { Icon: Brain, x: "-15%", y: "30%", delay: 2 },
  { Icon: Lightbulb, x: "30%", y: "25%", delay: 3 },
];

export default function WhyChooseAcadeX() {
  return (
    <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 overflow-hidden">
      {/* ✳️ Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {floatingIcons.map(({ Icon, x, y, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, y: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6 + i,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute text-blue-300/40"
            style={{
              left: `calc(50% + ${x})`,
              top: `calc(50% + ${y})`,
            }}
          >
            <Icon size={45} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* ✳️ Enhanced Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold mb-10 md:mb-12 text-center text-white relative inline-block"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          Why Choose AcadeX
        </span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
        />
      </motion.h2>

      {/* ✳️ Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              delay: i * 0.15,
              duration: 0.6,
              type: "spring",
            }}
            className="bg-gray-800/60 p-6 rounded-2xl shadow-lg hover:bg-gray-800/80 transition-all border border-gray-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-gray-400">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
