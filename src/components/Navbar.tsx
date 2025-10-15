"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 md:px-20 py-6 text-white"
    >
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        Acade<span className="text-blue-500">X</span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-10 text-sm font-medium">
        <Link
          href="#home"
          className="hover:text-blue-400 transition duration-300"
        >
          Home
        </Link>
        <Link
          href="#features"
          className="hover:text-blue-400 transition duration-300"
        >
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="hover:text-blue-400 transition duration-300"
        >
          How It Works
        </Link>
        <Link
          href="#about"
          className="hover:text-blue-400 transition duration-300"
        >
          About
        </Link>
        <Link
          href="#contact"
          className="hover:text-blue-400 transition duration-300"
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
}
