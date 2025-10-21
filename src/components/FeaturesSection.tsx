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
    <section className="relative py-20 text-gray-100 overflow-hidden bg-gray-900/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.h2
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="text-3xl md:text-4xl font-bold text-center mb-16"
>
  <motion.span
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    }}
    className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-[length:200%_200%] text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
  >
    Explore AcadeX Features
  </motion.span>
</motion.h2>


        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start space-x-5"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
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
