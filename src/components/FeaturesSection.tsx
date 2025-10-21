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
  Cpu,
} from "lucide-react";
import { Scan } from "lucide-react";


const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-blue-400" />,
    title: "Adaptive Exam Engine",
    desc: "Dynamically adjusts questions based on student performance for smarter assessments.",
  },
  {
    icon: <WifiOff className="w-8 h-8 text-blue-500" />,
    title: "Offline First Architecture",
    desc: "Exams, results, and data all work without internet — syncing happens automatically later.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-300" />,
    title: "Real-Time Analytics",
    desc: "View student performance dashboards and progress charts instantly.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Smart Student Profiles",
    desc: "Keep a detailed academic record — attendance, results, and learning trends.",
  },
  {
    icon: <Building2 className="w-8 h-8 text-blue-400" />,
    title: "Multi-Campus Integration",
    desc: "Manage multiple schools or branches seamlessly from one admin portal.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    title: "AI Integrity Shield",
    desc: "Advanced AI monitoring to detect cheating and enforce secure proctoring.",
  },
  {
    icon: <Database className="w-8 h-8 text-blue-400" />,
    title: "Hybrid Data Storage",
    desc: "Save and access data locally and in the cloud for full reliability.",
  },
  {
    icon: <Languages className="w-8 h-8 text-blue-300" />,
    title: "Global Language Support",
    desc: "Translate UI and content into multiple languages easily.",
  },
  {
  icon: <Scan className="w-8 h-8 text-blue-400" />,
  title: "Smart Anti-Cheat System",
  desc: "Detects tab switching, camera monitoring, or suspicious activity during exams to ensure fair assessment.",
},


];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 text-gray-100 overflow-hidden bg-gray-900/100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-20"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
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
                <h3 className="text-lg font-semibold mb-2 text-white">
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
