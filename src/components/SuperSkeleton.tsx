"use client";
import { motion } from "framer-motion";

export default function SuperSkeleton({
  type = "card",
  count = 1,
}: {
  type?: "card" | "table" | "section";
  count?: number;
}) {
  const base = "animate-pulse bg-white/10 rounded-xl";

  if (type === "table") {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className={`${base} h-10`} />
        ))}
      </div>
    );
  }

  if (type === "section") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`${base} h-40`}
          />
        ))}
      </div>
    );
  }

  // default = card
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`${base} h-28`}
        />
      ))}
    </div>
  );
}
