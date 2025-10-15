"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-20">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07101b] via-[#0b1220] to-[#07101b]" />

      {/* Left glow */}
      <motion.div
        aria-hidden
        className="absolute top-[6%] left-[-12%] w-[420px] h-[420px] rounded-full mix-blend-screen"
        style={{ background: "linear-gradient(180deg,#0ea5e9, #0369a1)" }}
        animate={{
          x: [0, 48, 0],
          y: [0, 28, 0],
          scale: [1, 1.04, 1],
          opacity: [0.45, 0.65, 0.45],
        }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Right glow */}
      <motion.div
        aria-hidden
        className="absolute bottom-[-12%] right-[-10%] w-[520px] h-[520px] rounded-full mix-blend-screen"
        style={{ background: "linear-gradient(180deg,#7dd3fc, #0369a1)" }}
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.07, 1],
          opacity: [0.28, 0.5, 0.28],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
    </div>
  );
}
