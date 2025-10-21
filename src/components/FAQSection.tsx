"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Can AcadeX work without internet access?",
    a: "Yes! AcadeX has a powerful Offline Exam Mode that lets you run exams even when there’s no connection. Once the device reconnects, all data syncs automatically to the cloud.",
  },
  {
    q: "How are results calculated on AcadeX?",
    a: "The Smart Exam Engine automatically marks objective questions, calculates totals, and generates detailed analytics instantly.",
  },
  {
    q: "Can AcadeX support multiple classes and schools?",
    a: "Yes. You can manage multiple classes or schools under one platform, each with fully isolated data.",
  },
  {
    q: "How does AcadeX prevent exam malpractice?",
    a: "With secure proctoring tools, the system detects suspicious activities and ensures exam integrity.",
  },
  {
    q: "What happens if there’s a power or network failure during an exam?",
    a: "No worries — AcadeX stores results locally and syncs when the connection or power returns.",
  },
  {
    q: "Can AcadeX work in different languages?",
    a: "Yes, AcadeX supports multiple languages for schools around the world.",
  },
  {
    q: "Is student data safe on AcadeX?",
    a: "Absolutely. All data is encrypted and backed up securely on both cloud and local storage.",
  },
  {
    q: "Do students get instant feedback after exams?",
    a: "Yes, results and performance analytics are generated instantly after submission.",
  },
  {
    q: "What makes AcadeX different from other systems?",
    a: "AcadeX combines offline reliability, AI security, and multi-school management — all in one sleek platform.",
  },
  {
    q: "Does AcadeX support both web and mobile platforms?",
    a: "Yes, AcadeX is fully responsive and works seamlessly across web and mobile devices for admins, teachers, and students.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-24 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-800/10 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 text-center relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-12"
        >
          Frequently Asked <span className="text-blue-500">Questions</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between border border-gray-700/60 rounded-2xl bg-gray-800/40 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.05)] h-full"
            >
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-blue-400 w-5 h-5" />
                  <span className="text-white font-medium">{item.q}</span>
                </div>
                <motion.div
                  animate={{ rotate: active === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-gray-400 w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-4 text-gray-400 text-sm leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
