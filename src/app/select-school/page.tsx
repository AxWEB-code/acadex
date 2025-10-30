"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ add this import
import { motion } from "framer-motion";
import { fetchJSON } from "@/lib/api";
import {
  Search,
  GraduationCap,
  School as SchoolIcon,
  MonitorSmartphone,
} from "lucide-react";

import Image from "next/image";

interface School {
  id: number;
  name: string;
  subdomain: string;
  logo?: string;
  schoolType: string;
  status?: "active" | "inactive" | "suspended" | null;
}

export default function SelectSchoolPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filtered, setFiltered] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await fetchJSON("/api/schools");
        setSchools(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load schools:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      schools.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.subdomain.toLowerCase().includes(q)
      )
    );
  }, [search, schools]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center sm:justify-center justify-start bg-gradient-to-b from-[#0a0a0f] via-[#0c0c15] to-[#111827] text-white overflow-hidden px-4 pt-6 sm:pt-10 pb-6">
  <GradientGlow />

  {/* 🔹 AcadeX Text Logo (top left) */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="absolute top-5 left-5 sm:top-8 sm:left-8 z-20 select-none"
  >
    <Link
      href="/"
      className="flex items-center gap-1 text-white font-extrabold text-lg sm:text-2xl tracking-wide"
    >
      <span className="text-blue-400">Acade</span>
      <span className="text-white">X</span>
    </Link>
  </motion.div>

  {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-center mb-6 sm:mb-10 z-10 mt-[120px] sm:mt-10"
>
  <h1 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-1 sm:mb-2">
    🎓 Select Your School Portal
  </h1>
  <p className="text-gray-400 text-sm sm:text-base">
    Choose your institution to continue to your login page
  </p>
</motion.div>



      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-8 w-full max-w-md z-10"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search school by name or subdomain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/15 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner shadow-blue-500/10 transition"
        />
      </motion.div>

      {/* School Grid */}
      <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 z-10 pb-28">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center text-lg">
            No schools found.
          </p>
        ) : (
          filtered.map((school) => (
            <motion.div
              key={school.id}
              whileHover={{
                y: -4,
                scale: 1.03,
                boxShadow: "0 0 25px rgba(59,130,246,0.25)",
              }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                localStorage.setItem("selectedSchool", JSON.stringify(school));
                window.location.href = "/portal";
              }}
              className={`relative cursor-pointer bg-[#181b2c]/95 rounded-2xl p-5 sm:p-6 backdrop-blur-md border ${getBorderColor(
                school.status
              )} transition-all duration-300 overflow-hidden`}
            >
              {/* faint background logo */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-[0.12] z-0 pointer-events-none"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={112}
                    height={112}
                    className="w-28 h-28 object-contain grayscale"
                  />
                ) : (
                  <span className="text-[70px] font-black bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent select-none">
                    {school.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </motion.div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={64}
                    height={64}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-blue-700 object-cover shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-semibold text-white shadow-md">
                    {school.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name + Status Dot */}
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">
                    {school.name}
                  </span>
                  <StatusDot status={school.status} />
                </h3>

                {/* School Type */}
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {school.schoolType === "TERTIARY" ? (
                    <GraduationCap size={12} className="text-blue-400" />
                  ) : school.schoolType === "CBT" ? (
                    <MonitorSmartphone size={12} className="text-blue-400" />
                  ) : (
                    <SchoolIcon size={12} className="text-blue-400" />
                  )}
                  {school.schoolType === "TERTIARY"
                    ? "Tertiary Institution"
                    : school.schoolType === "CBT"
                    ? "Computer-Based Center"
                    : "High School"}
                </p>

                <span className="text-[10px] text-blue-400/80 truncate">
                  {school.subdomain}.acadex.app
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ✅ Branded Footer */}
      <footer className="w-full flex justify-center items-center fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 px-3 z-50">
        <div className="bg-white/10 border border-white/10 backdrop-blur-lg px-5 py-2 rounded-full shadow-md text-gray-300 text-[10px] sm:text-xs flex items-center gap-1">
          <span>Powered by</span>
          <span className="text-blue-400 font-semibold">
            AxWEB Technologies
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ✅ Clean StatusDot */
function StatusDot({ status }: { status?: string | null }) {
  const base = "inline-block w-2.5 h-2.5 rounded-full";
  if (!status) return <span className={`${base} bg-gray-500`} />;
  switch (status.toLowerCase()) {
    case "active":
      return (
        <span
          className={`${base} bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.9)] animate-pulse`}
          title="Active"
        ></span>
      );
    case "inactive":
      return (
        <span
          className={`${base} bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]`}
          title="Inactive"
        ></span>
      );
    case "suspended":
      return (
        <span
          className={`${base} bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.8)]`}
          title="Suspended"
        ></span>
      );
    default:
      return <span className={`${base} bg-gray-500`} />;
  }
}

/* border color */
function getBorderColor(status?: string | null) {
  switch (status) {
    case "active":
      return "border-green-500/60 shadow-green-500/10";
    case "suspended":
      return "border-orange-400/70 shadow-orange-500/10";
    case "inactive":
      return "border-red-500/60 shadow-red-500/10";
    default:
      return "border-white/10 shadow-blue-700/10";
  }
}

/* glow background */
function GradientGlow() {
  return (
    <div className="absolute inset-0 -z-10">
      <motion.div
        className="absolute top-[25%] left-[10%] w-[300px] h-[300px] bg-blue-700/25 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-purple-700/25 rounded-full blur-3xl"
        animate={{ scale: [1.05, 1.25, 1.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* skeleton */
function SkeletonCard() {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-md animate-pulse flex flex-col items-center text-center space-y-3">
      <div className="w-14 h-14 bg-blue-900/20 rounded-full" />
      <div className="w-24 h-3 bg-blue-900/20 rounded" />
      <div className="w-16 h-2 bg-blue-900/10 rounded" />
      <div className="w-28 h-2 bg-blue-900/10 rounded" />
    </div>
  );
}