"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Example: send to your API route (/api/contact)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B1E] via-[#0A122E] to-[#0F1738]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 relative z-10">
        {/* Left Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Contact <span className="text-blue-500">AcadeX</span>
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-md">
            We’re always excited to hear from you — whether it’s support, partnership, or product
            inquiry. Send us a message and we’ll get back to you shortly.
          </p>

          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <Mail className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                support@acadex.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <Phone className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                +234 806 122 8340
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <MapPin className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Global — Empowering Schools Everywhere
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#0D132B]/60 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.07)]"
        >
          <div className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="peer w-full rounded-2xl bg-[#111936]/70 border border-gray-700 text-gray-100 px-4 pt-5 pb-2 focus:border-blue-500 outline-none transition-all duration-300 placeholder-transparent"
                placeholder="Your Name"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm"
              >
                Name
              </label>
            </div>

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full rounded-2xl bg-[#111936]/70 border border-gray-700 text-gray-100 px-4 pt-5 pb-2 focus:border-blue-500 outline-none transition-all duration-300 placeholder-transparent"
                placeholder="Your Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm"
              >
                Email
              </label>
            </div>

            {/* Message Field */}
            <div className="relative">
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="peer w-full rounded-2xl bg-[#111936]/70 border border-gray-700 text-gray-100 px-4 pt-5 pb-2 focus:border-blue-500 outline-none transition-all duration-300 placeholder-transparent resize-none"
                placeholder="Your Message"
                required
              />
              <label
                htmlFor="message"
                className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-400 peer-focus:text-sm"
              >
                Message
              </label>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl 
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
              hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 
              font-semibold text-white shadow-lg transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {/* Status Message */}
            {status && (
              <p className="text-sm text-center text-gray-400 pt-2">{status}</p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
