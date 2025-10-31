"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typed from "typed.js";

const testimonials = [
  { message: "AcadeX redefines exam management — fast, reliable, and smart.", author: "Engr. Tunde Adebayo" },
  { message: "Built with precision — it feels like tech crafted for schools.", author: "Adaora Nkem" },
  { message: "Our students write exams offline, yet results sync instantly.", author: "Dr. Florence Nwosu" },
  { message: "The admin portal saves hours of manual work every week.", author: "Mr. Emmanuel Eze" },
  { message: "AcadeX is bridging Africa's digital learning divide beautifully.", author: "Michael Johnson" },
  { message: "Simple, secure, and scalable — exactly what education needs.", author: "Faith Olorunfemi" },
  { message: "Offline or online — AcadeX ensures no student is left behind.", author: "Dr. Helen Okafor" },
  { message: "It feels futuristic — yet so easy for every school to use.", author: "Kingsley Ebere" },
];

export default function TestimonialPopup() {
  const typedRef = useRef<HTMLParagraphElement>(null);

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState<"bottom-right" | "bottom-left" | "bottom-center">("bottom-right");

  // control mobile-only hiding when scrolled past features
  const [mobileStop, setMobileStop] = useState(false);

  // how long the card stays visible, and the wait between cards
  const showDuration = 12000;
  const delayBetween = 12000;

  // choose a random bottom position (only side-to-side to avoid nav overlap)
  const randomPosition = useCallback(() => {
    const positions: typeof position[] = ["bottom-right", "bottom-left", "bottom-center"];
    setPosition(positions[Math.floor(Math.random() * positions.length)]);
  }, []);

  // Fade-out after typing completes
  useEffect(() => {
    if (!visible) return;

    const typed = new Typed(typedRef.current!, {
      strings: [
        `"${testimonials[index].message}" <br><span class='text-blue-400 text-xs sm:text-sm'>${testimonials[index].author}</span>`,
      ],
      typeSpeed: 30,
      showCursor: false,
      onComplete: () => {
        // keep it on screen for showDuration, then start exit
        const t = setTimeout(() => setVisible(false), showDuration);
        return () => clearTimeout(t);
      },
    });

    return () => typed.destroy();
  }, [index, visible]);

  // Loop messages (don't run if we must stop on mobile past features)
  useEffect(() => {
    if (mobileStop) return;

    if (!visible) {
      const t = setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        randomPosition();
        setVisible(true);
      }, delayBetween);
      return () => clearTimeout(t);
    }
  }, [visible, mobileStop, randomPosition]); // Added randomPosition to dependencies

  // Mobile-only: hide after scrolling past the Features section (smooth fade via AnimatePresence)
  useEffect(() => {
    const onScrollOrResize = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        setMobileStop(false);
        return;
      }

      // Try to locate the features container robustly:
      // 1) an element with id="features"
      // 2) a section/div that has the heading "Explore AcadeX Features" (fallback)
      let featuresEl = document.getElementById("features") as HTMLElement | null;

      if (!featuresEl) {
        // fallback try: the first element containing the heading
        const heading = Array.from(document.querySelectorAll("h2")).find((h) =>
          h.textContent?.toLowerCase().includes("explore acadex features")
        ) as HTMLElement | undefined;

        if (heading) {
          // assume section wrapper is the parent section
          featuresEl = heading.closest("section") as HTMLElement | null;
        }
      }

      if (!featuresEl) {
        setMobileStop(false);
        return;
      }

      const rect = featuresEl.getBoundingClientRect();
      // If the features section bottom is well above the viewport bottom,
      // we consider it "scrolled past" on mobile.
      const scrolledPast = rect.bottom < window.innerHeight * 0.05;
      setMobileStop(scrolledPast);
    };

    window.addEventListener("scroll", onScrollOrResize);
    window.addEventListener("resize", onScrollOrResize);
    // run once on mount
    onScrollOrResize();
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  // positioning utility
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-10 left-8";
      
      default:
        return "bottom-10 right-8";
    }
  };

  return (
    <AnimatePresence>
      {!mobileStop && visible && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 22 }}
          transition={{ duration: 0.5 }}
          className={`fixed ${getPositionClasses()} z-50`}
        >
          <div
            className="relative backdrop-blur-md bg-gray-900/70 border border-blue-500/30
                       shadow-[0_0_15px_rgba(59,130,246,0.25)]
                       rounded-2xl w-48 sm:max-w-sm px-3 py-3
                       flex items-center justify-center text-center
                       text-gray-200 text-xs sm:text-[0.9rem] leading-relaxed"
          >
            <button
              onClick={() => setVisible(false)}
              className="absolute top-1.5 right-2 text-gray-400 hover:text-gray-200 text-xs"
              aria-label="Close testimonial"
            >
              ✕
            </button>
            <p ref={typedRef} className="font-medium px-1 sm:px-2" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}