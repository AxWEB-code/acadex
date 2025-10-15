"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full fixed top-0 left-0 bg-white/70 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">AcadeX</h1>

        <ul className="hidden md:flex gap-8 text-gray-700">
          <li><a href="#how" className="hover:text-blue-600">How it Works</a></li>
          <li><a href="#features" className="hover:text-blue-600">Features</a></li>
          <li><a href="#demo" className="hover:text-blue-600">Demo</a></li>
          <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
        </ul>

        <a
          href="#get-started"
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </motion.nav>
  );
}
