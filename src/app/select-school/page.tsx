"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchJSON } from "@/lib/api";
import { Search, GraduationCap, School as SchoolIcon } from "lucide-react";

interface School {
  id: number;
  name: string;
  subdomain: string;
  logo?: string;
  schoolType: string;
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

  // 🔍 Filter as typing
  useEffect(() => {
    const query = search.toLowerCase();
    const filteredData = schools.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.subdomain.toLowerCase().includes(query)
    );
    setFiltered(filteredData);
  }, [search, schools]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0c0c15] to-[#111827] text-white overflow-hidden px-6 py-10">
      {/* Background Layers */}
      <GradientGlow />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
          🎓 Select Your School Portal
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Choose your institution to continue to your login page
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="relative mb-10 w-full max-w-md z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search school by name or subdomain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* School Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10">
        {loading ? (
          <p className="col-span-full text-gray-400 text-center text-lg">
            Loading schools...
          </p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center text-lg">
            No schools found.
          </p>
        ) : (
          filtered.map((school) => (
            <motion.div
              key={school.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                localStorage.setItem("selectedSchool", JSON.stringify(school));
                window.location.href = "/portal";
              }}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-md hover:shadow-blue-700/20 transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="w-16 h-16 rounded-full border border-blue-700 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-700/30 flex items-center justify-center text-lg font-semibold text-blue-100">
                    {school.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                  {school.name}
                </h3>
                <p className="text-sm text-gray-400">{school.schoolType}</p>
                <span className="text-xs text-blue-400/80">
                  {school.subdomain}.acadex.app
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------ BACKGROUND GLOW ------------------ */
function GradientGlow() {
  return (
    <div className="absolute inset-0 -z-10">
      <motion.div
        className="absolute top-[25%] left-[10%] w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-purple-700/20 rounded-full blur-3xl"
        animate={{ scale: [1.1, 1.3, 1.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
