/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);

  // 🧠 Load user info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("acadexUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  // 🧠 Get the logged-in role
  const role = user?.admin?.role || "mainAdmin";

  // 🎯 Define what each role can see
  const roleFeatures: Record<string, string[]> = {
    mainAdmin: ["Manage Admins", "Approve Exams", "System Logs", "Analytics Overview"],
    examAdmin: ["Create Exams", "Edit Questions", "Manage Exam Sessions"],
    resultAdmin: ["Input Results", "Edit Scores", "View Student Results"],
    admissionAdmin: ["Approve Students", "Deactivate Students", "Review Admission Requests"],
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-blue-400">
          Welcome, {role.replace(/([A-Z])/g, " $1")} 👋
        </h1>
        <p className="text-gray-400 text-sm">
          You’re logged in as <span className="text-blue-400 font-medium">{role}</span>
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {roleFeatures[role]?.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg hover:bg-white/15 transition"
          >
            <h3 className="text-lg font-semibold text-blue-300 mb-1">{feature}</h3>
            <p className="text-gray-400 text-sm">
              Manage all tasks related to <span className="font-medium">{feature.toLowerCase()}</span>.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
