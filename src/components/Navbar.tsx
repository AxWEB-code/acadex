"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full fixed top-0 left-0 bg-[#0E162B]/70 backdrop-blur-md z-50 border-b border-blue-900/40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">AcadeX</h1>

        <ul className="hidden md:flex gap-8 text-gray-300">
          {["How it Works", "Features", "Demo", "Contact"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative group"
              >
                <span className="transition text-gray-300 group-hover:text-blue-400">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#get-started"
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition shadow-md"
        >
          Get Started
        </a>
      </div>
    </motion.nav>
  );
}
