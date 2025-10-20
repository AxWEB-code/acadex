"use client";
import { motion } from "framer-motion";
import {
  BookOpen,
  WifiOff,
  BarChart3,
  Users,
  Building2,
  ShieldCheck,
  Database,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-blue-400" />,
    title: "Smart Exam Engine",
    desc: "Conduct intelligent, randomized, and time-bound exams seamlessly for any subject or level.",
  },
  {
    icon: <WifiOff className="w-8 h-8 text-blue-500" />,
    title: "Offline Mode",
    desc: "Run exams and store results even without internet — auto-syncs once online.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-300" />,
    title: "Instant Results",
    desc: "Automatically compute scores and provide analytics for teachers and students.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Student Management",
    desc: "Track attendance, performance, and history all in one simple dashboard.",
  },
  {
    icon: <Building2 className="w-8 h-8 text-blue-400" />,
    title: "Multi-School Support",
    desc: "Operate multiple schools under one platform with full data isolation.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    title: "Secure Proctoring",
    desc: "AI-driven cheat prevention ensures integrity during every exam session.",
  },
  {
    icon: <Database className="w-8 h-8 text-blue-400" />,
    title: "Cloud & Local Backup",
    desc: "Automatically save data safely both online and locally for reliability.",
  },
  {
    icon: <Languages className="w-8 h-8 text-blue-300" />,
    title: "Multi-Language Ready",
    desc: "Designed for global schools — switch languages seamlessly.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-15 text-gray-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-14"
        >
          Explore <span className="text-blue-500">AcadeX Features</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm bg-gray-800/30 text-center shadow-[0_0_10px_rgba(59,130,246,0.08)]"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gray-900/70 rounded-full border border-gray-700/50 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
