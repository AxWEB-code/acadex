"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-4 text-white flex items-center justify-between transition-all`}
      style={{
        // keep layout stable while allowing visual changes via classes below
      }}
    >
      {/* Dimmed glass when scrolled */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-300 ${
          scrolled
            ? "bg-black/30 backdrop-blur-md border-b border-white/6"
            : "bg-transparent"
        }`}
      />

      {/* Logo */}
      <Link href="/" className="relative z-20 text-2xl font-extrabold tracking-tight">
        Acade<span className="text-blue-400">X</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-10 text-sm font-medium z-20">
        {navLinks.map((link) => (
          <div key={link.name} className="relative group">
            <Link
              href={link.href}
              className="hover:text-blue-300 transition-colors duration-200"
            >
              {link.name}
            </Link>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </div>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden z-20"
        onClick={() => setIsOpen((s) => !s)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="absolute top-16 left-0 w-full z-10 flex justify-center"
          >
            <div className="w-full max-w-md mx-4 bg-blue-900/18 backdrop-blur-md border border-white/8 rounded-xl py-6 flex flex-col items-center space-y-4 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white text-lg hover:text-blue-300 transition font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
