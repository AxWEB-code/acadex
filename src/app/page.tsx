"use client";

import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import FloatingIcons from "@/components/FloatingIcons";


export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-100 overflow-hidden flex flex-col items-center justify-center">
      {/* Animated background shapes */}
      <AnimatedBackground />
      <Navbar />

    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f172a] opacity-90 -z-10" />
  <AnimatedBackground />
  <FloatingIcons />  {/* 🧠 Add this here */}


      {/* Hero Section */}
      <section className="relative text-center px-6 mt-16 md:mt-20 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Empowering the Future of{" "}
          <motion.span
            className="text-blue-500"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Academic Excellence
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-5 text-lg text-gray-300 leading-relaxed"
        >
          AcadeX is your all-in-one academic platform — designed for schools,
          teachers, and students. Conduct exams, manage results, and analyze
          performance both online and offline — efficiently and securely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-8 flex justify-center gap-4"
        >
          <a
            href="#get-started"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="#demo"
            className="px-8 py-4 border border-blue-600 text-blue-400 font-semibold rounded-full hover:bg-blue-900/30 transition"
          >
            Watch Demo
          </a>
        </motion.div>
      </section>
    </main>
  );
}
