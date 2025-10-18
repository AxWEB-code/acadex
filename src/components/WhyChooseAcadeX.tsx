"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { GraduationCap, WifiOff, BarChart3, Layers } from "lucide-react";

const features = [
  {
    icon: <WifiOff size={50} className="text-blue-400" />,
    title: "Offline Exam Mode",
    text: "Conduct secure exams even without internet access. Sync results once back online.",
  },
  {
    icon: <GraduationCap size={50} className="text-blue-400" />,
    title: "Instant Results",
    text: "Automatic result computation and analytics for teachers and students instantly.",
  },
  {
    icon: <BarChart3 size={50} className="text-blue-400" />,
    title: "Smart Performance Insights",
    text: "Track class performance and discover trends across subjects and sessions.",
  },
  {
    icon: <Layers size={50} className="text-blue-400" />,
    title: "Multi-School Management",
    text: "Handle multiple schools on one platform with centralized control and data sync.",
  },
];

export default function WhyChooseAcadeX() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const fadeLift = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1], // smoother cubic-bezier
      },
    }),
  };

  return (
    <div ref={ref} className="max-w-6xl mx-auto px-6">
      {/* ✳️ Elegant Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="text-4xl md:text-5xl font-bold mb-10 text-center text-white relative"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          Why Choose AcadeX
        </span>
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          initial={{ scaleX: 0 }}
          animate={controls}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.6 } },
          }}
        />
      </motion.h2>

      {/* ✨ Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate={controls}
            variants={fadeLift}
            className="bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-700 hover:bg-gray-800/80 transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div>{f.icon}</div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
