"use client";

import { motion } from "framer-motion";
import { GraduationCap, WifiOff, BarChart3, Layers } from "lucide-react";

const features = [
  {
    icon: <WifiOff size={40} className="text-blue-400" />,
    title: "Offline Exam Mode",
    text: "Conduct secure exams even without internet access. Sync results once back online.",
  },
  {
    icon: <GraduationCap size={40} className="text-blue-400" />,
    title: "Instant Results",
    text: "Automatic result computation and analytics for teachers and students instantly.",
  },
  {
    icon: <BarChart3 size={40} className="text-blue-400" />,
    title: "Smart Performance Insights",
    text: "Track class performance and discover trends across subjects and sessions.",
  },
  {
    icon: <Layers size={40} className="text-blue-400" />,
    title: "Multi-School Management",
    text: "Handle multiple schools on one platform with centralized control and data sync.",
  },
];

export default function WhyChooseAcadeX() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold mb-12 text-blue-400"
      >
        Why Choose AcadeX
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-800/60 p-6 rounded-2xl shadow-lg hover:bg-gray-800/80 transition-all border border-gray-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
