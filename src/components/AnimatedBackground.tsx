"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Glowing gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />

      {/* Floating glowing blobs */}
      <motion.div
        className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 50, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25"
        animate={{
          x: [0, -60, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    </div>
  );
}
