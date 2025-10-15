"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  const navItems = ["Home", "How it Works", "Features", "Demo", "Contact"];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl border-b border-blue-100/40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold text-blue-700 tracking-tight"
        >
          AcadeX
        </motion.h1>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navItems.map((item, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <a
                href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                className="relative hover:text-blue-600 transition-colors duration-200"
              >
                {item}
                <motion.span
                  className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Button */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#get-started"
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Get Started
        </motion.a>
      </div>
    </motion.nav>
  );
}
