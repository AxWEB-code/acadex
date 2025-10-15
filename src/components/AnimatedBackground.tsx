"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#0E162B] to-[#0B1120]" />

      {/* Floating blue glows */}
      <motion.div
        className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-700/40 rounded-full mix-blend-screen filter blur-[150px]"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full mix-blend-screen filter blur-[180px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </div>
  );
}
