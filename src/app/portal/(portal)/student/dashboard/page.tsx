"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, GraduationCap, Bell } from "lucide-react";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("acadexUser");
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#111827]/80 border border-white/10 p-6 rounded-2xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-blue-400">
          Welcome back, {student?.student?.fullName?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Here’s your performance snapshot and recent updates.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: "Average Score",
            value: "78%",
            icon: <BarChart3 size={26} className="text-blue-400" />,
            color: "from-blue-600/20 to-blue-400/10",
          },
          {
            label: "Passed Exams",
            value: "12",
            icon: <GraduationCap size={26} className="text-green-400" />,
            color: "from-green-600/20 to-green-400/10",
          },
          {
            label: "New Notifications",
            value: "3",
            icon: <Bell size={26} className="text-yellow-400" />,
            color: "from-yellow-600/20 to-yellow-400/10",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`p-5 rounded-xl bg-gradient-to-br ${item.color} border border-white/10 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm">{item.label}</h3>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder Chart Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#111827]/80 border border-white/10 p-6 rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-blue-400 mb-3">Performance Overview</h2>
        <div className="text-gray-500 text-sm text-center py-10">
          📊 Chart coming soon (we’ll add Recharts integration here)
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#111827]/80 border border-white/10 p-6 rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-blue-400 mb-3">Recent Notifications</h2>
        <ul className="space-y-3 text-sm">
          <li className="text-gray-300">✅ Your exam results for Physics 2025 have been released!</li>
          <li className="text-gray-300">🗓️ New exam scheduled: 2nd Semester General Test.</li>
          <li className="text-gray-300">🎓 Your registration has been approved.</li>
        </ul>
      </motion.div>
    </div>
  );
}
