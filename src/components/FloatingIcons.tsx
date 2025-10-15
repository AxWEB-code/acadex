"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Brain,
  PenLine,
  Lightbulb,
  Calculator,
  Globe,
  Laptop,
  ClipboardList,
  Users,
  FlaskRound,
  Ruler,
  Compass,
  Microscope,
  ScrollText,
  Beaker,
} from "lucide-react";

const icons = [
  { Icon: BookOpen, x: "-35%", y: "-15%", delay: 0 },
  { Icon: GraduationCap, x: "40%", y: "-25%", delay: 0.5 },
  { Icon: Brain, x: "-20%", y: "25%", delay: 1 },
  { Icon: PenLine, x: "25%", y: "15%", delay: 1.5 },
  { Icon: Lightbulb, x: "-40%", y: "10%", delay: 2 },
  { Icon: Calculator, x: "15%", y: "35%", delay: 2.5 },
  { Icon: Globe, x: "-25%", y: "-25%", delay: 3 },
  { Icon: Laptop, x: "45%", y: "5%", delay: 3.5 },
  { Icon: ClipboardList, x: "-10%", y: "45%", delay: 4 },
  { Icon: Users, x: "20%", y: "-35%", delay: 4.5 },
  { Icon: FlaskRound, x: "-45%", y: "-35%", delay: 1.2 },
  { Icon: Ruler, x: "30%", y: "45%", delay: 1.8 },
  { Icon: Compass, x: "-50%", y: "30%", delay: 2.3 },
  { Icon: Microscope, x: "50%", y: "-10%", delay: 3.1 },
  { Icon: ScrollText, x: "0%", y: "-45%", delay: 3.8 },
  { Icon: Beaker, x: "-15%", y: "50%", delay: 4.2 },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 5 + (i % 3), // small variations in speed
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute text-blue-300/40 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]"
          style={{
            left: `calc(50% + ${x})`,
            top: `calc(50% + ${y})`,
          }}
        >
          <Icon size={90} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
}
