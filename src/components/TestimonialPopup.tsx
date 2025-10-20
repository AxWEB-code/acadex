"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typed from "typed.js";

const testimonials = [
  {
    message: "AcadeX redefines exam management — fast, reliable, and smart.",
    author: "Engr. Tunde Adebayo",
  },
  {
    message: "Built with precision — it feels like tech crafted for schools.",
    author: "Adaora Nkem",
  },
  {
    message: "Our students write exams offline, yet results sync instantly.",
    author: "Dr. Florence Nwosu",
  },
  {
    message: "The admin portal saves hours of manual work every week.",
    author: "Mr. Emmanuel Eze",
  },
  {
    message: "AcadeX is bridging Africa's digital learning divide beautifully.",
    author: "Michael Johnson",
  },
  {
    message: "Simple, secure, and scalable — exactly what education needs.",
    author: "Faith Olorunfemi",
  },
  {
    message: "Offline or online — AcadeX ensures no student is left behind.",
    author: "Dr. Helen Okafor",
  },
  {
    message: "It feels futuristic — yet so easy for every school to use.",
    author: "Kingsley Ebere",
  },
];

export default function TestimonialPopup() {
  // FIX: Changed HTMLSpanElement to HTMLParagraphElement
  const typedRef = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState("bottom-right");

  const showDuration = 12000; // show time
  const delayBetween = 12000; // wait before next

  // pick a random bottom position
  const randomPosition = () => {
    const positions = ["bottom-right", "bottom-left", "bottom-center"];
    const next = positions[Math.floor(Math.random() * positions.length)];
    setPosition(next);
  };

  // typewriter animation
  useEffect(() => {
    if (!visible) return;

    const typed = new Typed(typedRef.current!, {
      strings: [
        `"${testimonials[index].message}" <br><span class='text-blue-400 text-xs sm:text-sm'>${testimonials[index].author}</span>`,
      ],
      typeSpeed: 30,
      showCursor: false,
      onComplete: () => {
        setTimeout(() => setVisible(false), showDuration);
      },
    });

    return () => typed.destroy();
  }, [index, visible]);

  // loop through messages
  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        randomPosition();
        setVisible(true);
      }, delayBetween);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  // position classes
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-10 left-8";
      
      case "bottom-right":
        return "bottom-10 right-8";
      default:
        return "bottom-10 right-8";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className={`fixed ${getPositionClasses()} z-50`}
        >
          <div
  className={`relative backdrop-blur-md bg-gray-900/70 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]
  rounded-2xl w-48 h-30 sm:max-w-sm sm:h-auto px-3 py-3 flex items-center justify-center text-center text-gray-200 text-xs sm:text-[0.9rem] leading-relaxed`}
>
  <button
    onClick={() => setVisible(false)}
    className="absolute top-1.5 right-2 text-gray-400 hover:text-gray-200 text-xs"
  >
    ✕
  </button>
  <p ref={typedRef} className="font-medium px-1 sm:px-2"></p>
</div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}