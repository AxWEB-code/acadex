"use client";

import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-gray-800 overflow-hidden flex flex-col items-center justify-center">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-center px-6 mt-32 md:mt-40 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-blue-700 leading-tight"
        >
          Empowering the Future of{" "}
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Academic Excellence
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg text-gray-600 leading-relaxed"
        >
          AcadeX is your all-in-one academic platform — designed for schools,
          teachers, and students. Conduct exams, manage results, and analyze
          performance online or offline — efficiently and securely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 flex justify-center gap-4"
        >
          <a
            href="#get-started"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="#demo"
            className="px-8 py-4 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
          >
            Watch Demo
          </a>
        </motion.div>
      </section>
    </main>
  );
}
