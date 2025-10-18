"use client";

import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import FloatingIcons from "@/components/FloatingIcons";
import WhyChooseAcadeX from "@/components/WhyChooseAcadeX"; // ✳️ new section

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-100 overflow-hidden">
      {/* Animated background & navbar */}
      <AnimatedBackground />
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f172a] opacity-90 -z-10" />
      <FloatingIcons />

      {/* 🎯 HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Empowering the Future of{" "}
          <motion.span
            className="text-blue-500"
            animate={{ opacity: [1, 0.5, 1] }}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-5 text-lg text-gray-300 leading-relaxed"
        >
          AcadeX is your all-in-one academic platform built for schools, 
          teachers, and students. Manage digital exams, compute results 
          instantly, and keep records safe — online or offline. 
          <br />
          <span className="text-blue-400">
            Simple, Secure, and Smart — the future of academic testing starts here.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center gap-4"
        >
          <a
            href="#get-started"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>

          <button
            onClick={() => {
              const aboutSection = document.getElementById("about");
              aboutSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 border border-blue-600 text-blue-400 font-semibold rounded-full hover:bg-blue-900/30 transition"
          >
            Learn More
          </button>
        </motion.div>
      </section>

      {/* 🌟 WHY CHOOSE ACADEX SECTION */}
      <section id="about" className="py-24 w-full bg-gray-900/50 text-center">
        <WhyChooseAcadeX />
      </section>
    </main>
  );
}
