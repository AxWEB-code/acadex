"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-gray-800 overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-32 text-center max-w-3xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-700 leading-tight">
          The Next Generation Academic Platform
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          AcadeX helps institutions conduct exams, manage students, and analyze performance —
          online or offline — seamlessly and securely.
        </p>
        <div className="mt-8">
          <a
            href="#get-started"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </section>
    </main>
  );
}
