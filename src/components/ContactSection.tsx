"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative py-24 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-800/10 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">
        {/* Left - Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in <span className="text-blue-500">Touch</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Have a question or want to learn more about AcadeX? We’d love to hear from you.  
            Fill out the form or reach us directly through any of the contacts below.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-400 w-6 h-6" />
              <span>support@acadex.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-400 w-6 h-6" />
              <span>+1 (800) 555-ACDX</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-400 w-6 h-6" />
              <span>Worldwide – Online Education Platform</span>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/60 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-gray-900/70 rounded-xl border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-gray-900/70 rounded-xl border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-3 bg-gray-900/70 rounded-xl border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-white transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
