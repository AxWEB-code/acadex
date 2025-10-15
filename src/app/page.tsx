"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 bg-gradient-to-b from-blue-50 to-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-bold mb-6"
        >
          Welcome to <span className="text-blue-600">AcadeX</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-2xl text-gray-600 text-lg mb-8"
        >
          A powerful, lightweight academic management system designed for schools,
          exam officers, and students — online or offline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Link
            href="#portals"
            className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 transition"
          >
            Explore Portals <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#about"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* About / How It Works */}
      <section
        id="about"
        className="py-24 bg-white text-center px-6 max-w-5xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-semibold mb-8"
        >
          How <span className="text-blue-600">AcadeX</span> Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 max-w-3xl mx-auto text-lg"
        >
          AcadeX connects super admins, schools, and students under one
          platform. Each school manages its operations while the central AcadeX
          hub ensures secure synchronization, real-time reporting, and
          customizable branding.
        </motion.p>
      </section>

      {/* Portal Cards */}
      <section
        id="portals"
        className="py-24 bg-blue-50 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-semibold mb-12"
        >
          Choose Your Portal
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Super Admin",
              desc: "Manage all schools, monitor performance, and control system settings centrally.",
              color: "bg-blue-600",
              href: "/super-admin",
            },
            {
              title: "School Admin",
              desc: "Handle admissions, exams, results, and student records efficiently.",
              color: "bg-white border border-blue-200",
              href: "/school-admin",
            },
            {
              title: "Student Portal",
              desc: "Access exams, results, and personal data on web or mobile seamlessly.",
              color: "bg-blue-600",
              href: "/student",
            },
          ].map((portal, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`${portal.color} rounded-2xl shadow-md p-8 text-left flex flex-col justify-between transition`}
            >
              <h3
                className={`text-2xl font-semibold mb-4 ${
                  portal.color.includes("bg-blue-600")
                    ? "text-white"
                    : "text-blue-700"
                }`}
              >
                {portal.title}
              </h3>
              <p
                className={`mb-6 ${
                  portal.color.includes("bg-blue-600")
                    ? "text-blue-100"
                    : "text-gray-600"
                }`}
              >
                {portal.desc}
              </p>
              <Link
                href={portal.href}
                className={`px-5 py-2 rounded-full font-medium text-center ${
                  portal.color.includes("bg-blue-600")
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Go to Portal
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>
          © {new Date().getFullYear()} <span className="text-blue-600 font-medium">AcadeX</span>.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
}
