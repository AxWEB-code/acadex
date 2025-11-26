"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import FadeIn from "@/components/FadeIn";
import SuperSkeleton from "@/components/SuperSkeleton";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  Settings,
  Key,
  FileText,
  Home,
  Menu,
  X,
  GraduationCap,
  Search,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchJSON } from "@/lib/api";



/* shadcn/ui */
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 10;

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

type SortConfig = { column: string; direction: "asc" | "desc" } | null;

export default function SchoolDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params);







  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [q, setQ] = useState("");
  
  const [school, setSchool] = useState<any>(null);

  // Sorting state per tab
  const [sortState, setSortState] = useState<{
    students: SortConfig;
    exams: SortConfig;
    results: SortConfig;
    admins: SortConfig;
  }>({
    students: null,
    exams: null,
    results: null,
    admins: null,
  });

  // Pagination state per tab
  const [pages, setPages] = useState({
    students: 1,
    exams: 1,
    results: 1,
    admins: 1,
  });

  // Filters
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const [studentGenderFilter, setStudentGenderFilter] = useState("all");

  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [examStatusFilter, setExamStatusFilter] = useState("all");
  const [examModeFilter, setExamModeFilter] = useState("all");

  const [resultRemarkFilter, setResultRemarkFilter] = useState("all");

  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [adminRoleFilter, setAdminRoleFilter] = useState("all");

  // --- Mock datasets (replace with API later)
  const [students, setStudents] = useState<any[]>([]);


  const exams = useMemo(
    () => [
      {
        code: "EX-2310-OBJ",
        title: "General Nursing (Objective)",
        type: "Objective",
        mode: "ONLINE",
        status: "LIVE",
        students: 312,
        start: "2025-10-08",
        end: "2025-10-08",
      },
      {
        code: "EX-2311-THY",
        title: "Anatomy Essay I",
        type: "Theory",
        mode: "OFFLINE",
        status: "CLOSED",
        students: 124,
        start: "2025-09-20",
        end: "2025-09-20",
      },
      {
        code: "EX-2312-PRC",
        title: "Practical Lab Check",
        type: "Practical",
        mode: "ONLINE",
        status: "APPROVED",
        students: 98,
        start: "2025-11-02",
        end: "2025-11-02",
      },
    ],
    []
  );

  const results = useMemo(
    () => [
      {
        admissionNo: "ECNS/2023/102/A",
        rollNo: "LS-101",
        exam: "General Nursing",
        examType: "Objective",
        year: 2025,
        score: 82,
        remark: "PASSED",
      },
      {
        admissionNo: "ECNS/2023/024/A",
        rollNo: "LS-117",
        exam: "Anatomy Essay I",
        examType: "Theory",
        year: 2025,
        score: 42,
        remark: "FAILED",
      },
      {
        admissionNo: "ECNS/M/2023/157/A",
        rollNo: "LS-448",
        exam: "Practical Lab Check",
        examType: "Practical",
        year: 2025,
        score: 74,
        remark: "PASSED",
      },
    ],
    []
  );

  const admins = useMemo(
    () => [
      {
        name: "Stella Okafor",
        role: "Exam Officer",
        email: "stella@ecn.edu",
        status: "Active",
        lastLogin: "2025-11-10 08:21",
      },
      {
        name: "Daniel Obi",
        role: "Result Admin",
        email: "daniel@ecn.edu",
        status: "Active",
        lastLogin: "2025-11-09 19:42",
      },
      {
        name: "Ifeanyi N.",
        role: "General Admin",
        email: "ifeanyi@ecn.edu",
        status: "Suspended",
        lastLogin: "—",
      },
    ],
    []
  );



  useEffect(() => {
  async function loadStudents() {
  try {
    const data = await fetchJSON(`/api/superadmin/schools/${id}/students`);
    setStudents(data.students || []);
  } catch (err) {
    console.error("Failed to load students", err);
  }
}


  loadStudents();
}, [id]);

 useEffect(() => {
  async function loadSchool() {
  try {
    const data = await fetchJSON(`/api/superadmin/schools/${id}`);
    setSchool(data);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
}


  loadSchool();
}, [id]);


  // Reset page to 1 whenever search, tab or filters change
  useEffect(() => {
    setPages((prev) => ({ ...prev, [activeTab]: 1 }));
  }, [
    activeTab,
    q,
    studentStatusFilter,
    studentGenderFilter,
    examTypeFilter,
    examStatusFilter,
    examModeFilter,
    resultRemarkFilter,
    adminStatusFilter,
    adminRoleFilter,
  ]);

  if (loading || !school) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050509] via-[#0a0a12] to-[#0c0f18] text-white p-6">
        <SuperSkeleton count={4} />
      </div>
    );
  }

  // ---- generic helpers ----
  const filterByQuery = <T extends Record<string, any>>(rows: T[]): T[] => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        String(v ?? "").toLowerCase().includes(term)
      )
    );
  };

  const handleSort = (tab: keyof typeof sortState, column: string) => {
    setSortState((prev) => {
      const current = prev[tab];
      if (current && current.column === column) {
        const nextDirection = current.direction === "asc" ? "desc" : "asc";
        return { ...prev, [tab]: { column, direction: nextDirection } };
      }
      return { ...prev, [tab]: { column, direction: "asc" } };
    });
  };

  const applySort = <T extends Record<string, any>>(
    rows: T[],
    tab: keyof typeof sortState
  ): T[] => {
    const config = sortState[tab];
    if (!config) return rows;
    const { column, direction } = config;
    const sorted = [...rows].sort((a, b) => {
      const av = a[column];
      const bv = b[column];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const isNumber =
        typeof av === "number" || typeof bv === "number" || column === "year";
      if (isNumber) {
        const na = Number(av);
        const nb = Number(bv);
        return direction === "asc" ? na - nb : nb - na;
      }
      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      if (sa < sb) return direction === "asc" ? -1 : 1;
      if (sa > sb) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortIndicator = (tab: keyof typeof sortState, column: string) => {
    const config = sortState[tab];
    if (!config || config.column !== column) {
      return <span className="text-[10px] text-white/40">↕</span>;
    }
    return (
      <span className="text-[10px] text-white/60">
        {config.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  const setPage = (tab: keyof typeof pages, value: number) => {
    setPages((prev) => ({ ...prev, [tab]: value }));
  };

  // ---- tab-specific filters ----
  const applyStudentFilters = (rows: typeof students) =>
    rows.filter((s) => {
      if (
        studentStatusFilter !== "all" &&
        s.status.toLowerCase() !== studentStatusFilter
      )
        return false;
      if (
        studentGenderFilter !== "all" &&
        s.gender &&
        s.gender.toLowerCase() !== studentGenderFilter
      )
        return false;
      return true;
    });

  const applyExamFilters = (rows: typeof exams) =>
    rows.filter((e) => {
      if (
        examTypeFilter !== "all" &&
        e.type.toLowerCase() !== examTypeFilter
      )
        return false;
      if (
        examStatusFilter !== "all" &&
        e.status.toLowerCase() !== examStatusFilter
      )
        return false;
      if (
        examModeFilter !== "all" &&
        e.mode.toLowerCase() !== examModeFilter
      )
        return false;
      return true;
    });

  const applyResultFilters = (rows: typeof results) =>
    rows.filter((r) => {
      if (
        resultRemarkFilter !== "all" &&
        r.remark.toLowerCase() !== resultRemarkFilter
      )
        return false;
      return true;
    });

  const applyAdminFilters = (rows: typeof admins) =>
    rows.filter((a) => {
      if (
        adminStatusFilter !== "all" &&
        a.status.toLowerCase() !== adminStatusFilter
      )
        return false;
      if (
        adminRoleFilter !== "all" &&
        a.role.toLowerCase() !== adminRoleFilter
      )
        return false;
      return true;
    });

  // precompute data per tab
  const studentsFiltered = filterByQuery(applyStudentFilters(students));
  const studentsSorted = applySort(studentsFiltered, "students");
  const studentsTotalPages = Math.max(
    1,
    Math.ceil(studentsSorted.length / PAGE_SIZE)
  );
  const studentsPage = Math.min(pages.students, studentsTotalPages);
  const studentsPageRows = studentsSorted.slice(
    (studentsPage - 1) * PAGE_SIZE,
    studentsPage * PAGE_SIZE
  );

  const examsFiltered = filterByQuery(applyExamFilters(exams));
  const examsSorted = applySort(examsFiltered, "exams");
  const examsTotalPages = Math.max(
    1,
    Math.ceil(examsSorted.length / PAGE_SIZE)
  );
  const examsPage = Math.min(pages.exams, examsTotalPages);
  const examsPageRows = examsSorted.slice(
    (examsPage - 1) * PAGE_SIZE,
    examsPage * PAGE_SIZE
  );

  const resultsFiltered = filterByQuery(applyResultFilters(results));
  const resultsSorted = applySort(resultsFiltered, "results");
  const resultsTotalPages = Math.max(
    1,
    Math.ceil(resultsSorted.length / PAGE_SIZE)
  );
  const resultsPage = Math.min(pages.results, resultsTotalPages);
  const resultsPageRows = resultsSorted.slice(
    (resultsPage - 1) * PAGE_SIZE,
    resultsPage * PAGE_SIZE
  );

  const adminsFiltered = filterByQuery(applyAdminFilters(admins));
  const adminsSorted = applySort(adminsFiltered, "admins");
  const adminsTotalPages = Math.max(
    1,
    Math.ceil(adminsSorted.length / PAGE_SIZE)
  );
  const adminsPage = Math.min(pages.admins, adminsTotalPages);
  const adminsPageRows = adminsSorted.slice(
    (adminsPage - 1) * PAGE_SIZE,
    adminsPage * PAGE_SIZE
  );

  return (
    <FadeIn>
      <div className="min-h-screen flex bg-gradient-to-b from-[#050509] via-[#0a0a12] to-[#0c0f18] text-white overflow-hidden">
        {/* Glow */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-blue-700/15 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-fuchsia-700/15 blur-[140px]" />
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-white/10 bg-white/[0.03] flex flex-col justify-between transition-transform duration-300 z-40",
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div>
            <div className="px-5 py-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <Image
                  src="/acadex-logo.png"
                  alt="AcadeX"
                  width={36}
                  height={36}
                  className="rounded-full border border-white/20"
                />
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    AcadeX Console
                  </h2>
                  <p className="text-[11px] text-blue-400/70">
                    SuperAdmin Access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="px-3 py-4 text-sm space-y-1">
              <NavItem href="/superadmin/dashboard" icon={Home}>
                Overview
              </NavItem>
              <NavItem href="/superadmin/schools" icon={Building2} active>
                Schools
              </NavItem>
              <NavItem href="/superadmin/exams" icon={BookOpen}>
                Exams
              </NavItem>
              <NavItem href="/superadmin/admins" icon={Users}>
                Admin Accounts
              </NavItem>
              <NavItem href="/superadmin/logs" icon={FileText}>
                Logs & Activities
              </NavItem>
              <NavItem href="/superadmin/keys" icon={Key}>
                Access Keys
              </NavItem>
              <NavItem href="/superadmin/settings" icon={Settings}>
                Platform Settings
              </NavItem>
            </nav>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs mb-3">
              <p className="text-white/60">Logged in as</p>
              <p className="font-semibold text-blue-300 mt-1">SuperAdmin</p>
            </div>
            <NavItem href="/portal" icon={LogOut}>
              Logout
            </NavItem>
            <p className="text-xs text-white/30 text-center mt-3">
              © 2025 AcadeX Console
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 p-6 space-y-8">
          {/* Mobile topbar */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold">School</h1>
            <Image
              src="/acadex-logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-full border border-white/20"
            />
          </div>

          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
  <div className="flex items-center gap-4">
    {school.logo ? (
      <Image
        src={school.logo}
        alt={school.name || "School Logo"}
        width={56}
        height={56}
        className="rounded-lg object-cover"
      />
    ) : (
      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        No Logo
      </div>
    )}

    <div>
      <h1 className="text-xl font-semibold">{school.name}</h1>
      <p className="text-white/50 text-sm">{school.code}</p>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
      Active
    </Badge>
    <span className="text-xs text-white/50">
      Joined {school.joined}
    </span>
  </div>
</div>


            <Separator className="my-4 bg-white/10" />

            <div className="grid sm:grid-cols-4 gap-3">
              <MiniStat
                label="Students"
                value={school.students?.length ?? 0}
                icon={<Users className="size-4" />}
              />
              <MiniStat
                label="Exams"
                value={school.exams?.length ?? 0}
                icon={<BookOpen className="size-4" />}
              />
              <MiniStat
                label="Results"
                value={school.examResults?.length ?? 0}
                icon={<BarChart3 className="size-4" />}
              />
              <MiniStat
                label="Admins"
                value={school.admins?.length ?? 0}
                icon={<GraduationCap className="size-4" />}
              />
            </div>
          </motion.div>

          {/* Tabs + search + filters + tables */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tabs row + search + filters */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <TabsList className="bg-white/[0.05] border border-white/10">
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="exams">Exams</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="admins">Admins</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 w-full sm:w-72">
                  <Search size={16} className="text-white/40" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search current table…"
                    className="h-6 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Tab-specific filters row */}
              {activeTab === "students" && (
                <div className="flex flex-wrap gap-3 text-xs">
                  <Select
                    value={studentStatusFilter}
                    onValueChange={setStudentStatusFilter}
                  >
                    <SelectTrigger className="h-8 w-40 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Status: All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={studentGenderFilter}
                    onValueChange={setStudentGenderFilter}
                  >
                    <SelectTrigger className="h-8 w-40 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Gender: All</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "exams" && (
                <div className="flex flex-wrap gap-3 text-xs">
                  <Select
                    value={examTypeFilter}
                    onValueChange={setExamTypeFilter}
                  >
                    <SelectTrigger className="h-8 w-40 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Type: All</SelectItem>
                      <SelectItem value="objective">Objective</SelectItem>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={examModeFilter}
                    onValueChange={setExamModeFilter}
                  >
                    <SelectTrigger className="h-8 w-36 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Mode: All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={examStatusFilter}
                    onValueChange={setExamStatusFilter}
                  >
                    <SelectTrigger className="h-8 w-40 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Status: All</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "results" && (
                <div className="flex flex-wrap gap-3 text-xs">
                  <Select
                    value={resultRemarkFilter}
                    onValueChange={setResultRemarkFilter}
                  >
                    <SelectTrigger className="h-8 w-44 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Remark" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Remark: All</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "admins" && (
                <div className="flex flex-wrap gap-3 text-xs">
                  <Select
                    value={adminStatusFilter}
                    onValueChange={setAdminStatusFilter}
                  >
                    <SelectTrigger className="h-8 w-40 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Status: All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={adminRoleFilter}
                    onValueChange={setAdminRoleFilter}
                  >
                    <SelectTrigger className="h-8 w-44 bg-white/[0.05] border-white/10 text-xs">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Role: All</SelectItem>
                      <SelectItem value="exam officer">
                        Exam Officer
                      </SelectItem>
                      <SelectItem value="result admin">
                        Result Admin
                      </SelectItem>
                      <SelectItem value="general admin">
                        General Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Students Table */}
            <TabsContent value="students" className="mt-4">
              <GlassCard>
                <DataNote>
                  Showing {studentsPageRows.length} of {studentsFiltered.length}{" "}
                  students
                </DataNote>
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <SortableHead
                        onClick={() =>
                          handleSort("students", "admissionNo")
                        }
                      >
                        Admission No {sortIndicator("students", "admissionNo")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("students", "rollNo")}
                      >
                        Roll No {sortIndicator("students", "rollNo")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("students", "name")}
                      >
                        Name {sortIndicator("students", "name")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("students", "class")}
                      >
                        Class {sortIndicator("students", "class")}
                      </SortableHead>
                      <SortableHead
                        onClick={() =>
                          handleSort("students", "department")
                        }
                      >
                        Department {sortIndicator("students", "department")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("students", "gender")}
                      >
                        Gender {sortIndicator("students", "gender")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("students", "status")}
                      >
                        Status {sortIndicator("students", "status")}
                      </SortableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsPageRows.map((s, i) => (
                      <TableRow key={i}>
                        <TableCell>{s.admissionNo}</TableCell>
                        <TableCell>
                          {s.rollNo ?? (
                            <span className="text-white/40">—</span>
                          )}
                        </TableCell>
                        <TableCell>
  {s.name || <span className="text-white/40">—</span>}
</TableCell>

<TableCell>
  {s.class?.trim() ? s.class : <span className="text-white/40">—</span>}
</TableCell>


                        <TableCell>
                          {s.department ?? (
                            <span className="text-white/40">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {s.gender ?? (
                            <span className="text-white/40">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "capitalize",
                              s.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {s.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-400 hover:text-blue-300 text-xs">
                              View
                            </button>
                            <RowActions
                              items={[
                                "View profile",
                                "Suspend student",
                                "Reset password",
                              ]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={studentsPage}
                  totalPages={studentsTotalPages}
                  onPageChange={(p) => setPage("students", p)}
                />
              </GlassCard>
            </TabsContent>

            {/* Exams Table */}
            <TabsContent value="exams" className="mt-4">
              <GlassCard>
                <DataNote>
                  Showing {examsPageRows.length} of {examsFiltered.length} exams
                </DataNote>
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <SortableHead
                        onClick={() => handleSort("exams", "code")}
                      >
                        Exam Code {sortIndicator("exams", "code")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "title")}
                      >
                        Title {sortIndicator("exams", "title")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "type")}
                      >
                        Type {sortIndicator("exams", "type")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "mode")}
                      >
                        Mode {sortIndicator("exams", "mode")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "status")}
                      >
                        Status {sortIndicator("exams", "status")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "students")}
                      >
                        Students {sortIndicator("exams", "students")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "start")}
                      >
                        Start {sortIndicator("exams", "start")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("exams", "end")}
                      >
                        End {sortIndicator("exams", "end")}
                      </SortableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examsPageRows.map((e, i) => (
                      <TableRow key={i}>
                        <TableCell>{e.code}</TableCell>
                        <TableCell>{e.title}</TableCell>
                        <TableCell>{e.type}</TableCell>
                        <TableCell>{e.mode}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              e.status === "LIVE" &&
                                "bg-blue-500/20 text-blue-300",
                              e.status === "APPROVED" &&
                                "bg-emerald-500/20 text-emerald-400",
                              e.status === "CLOSED" &&
                                "bg-white/10 text-white/70"
                            )}
                          >
                            {e.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{e.students}</TableCell>
                        <TableCell>{e.start}</TableCell>
                        <TableCell>{e.end}</TableCell>
                        <TableCell className="text-right">
                          <RowActions
                            items={[
                              "View exam",
                              "View results",
                              "Close exam",
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={examsPage}
                  totalPages={examsTotalPages}
                  onPageChange={(p) => setPage("exams", p)}
                />
              </GlassCard>
            </TabsContent>

            {/* Results Table */}
            <TabsContent value="results" className="mt-4">
              <GlassCard>
                <DataNote>
                  Showing {resultsPageRows.length} of {resultsFiltered.length}{" "}
                  results
                </DataNote>
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <SortableHead
                        onClick={() =>
                          handleSort("results", "admissionNo")
                        }
                      >
                        Admission No{" "}
                        {sortIndicator("results", "admissionNo")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("results", "rollNo")}
                      >
                        Roll No {sortIndicator("results", "rollNo")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("results", "exam")}
                      >
                        Exam {sortIndicator("results", "exam")}
                      </SortableHead>
                      <SortableHead
                        onClick={() =>
                          handleSort("results", "examType")
                        }
                      >
                        Type {sortIndicator("results", "examType")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("results", "year")}
                      >
                        Year {sortIndicator("results", "year")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("results", "score")}
                      >
                        Score {sortIndicator("results", "score")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("results", "remark")}
                      >
                        Remark {sortIndicator("results", "remark")}
                      </SortableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsPageRows.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.admissionNo}</TableCell>
                        <TableCell>{r.rollNo}</TableCell>
                        <TableCell>{r.exam}</TableCell>
                        <TableCell>{r.examType}</TableCell>
                        <TableCell>{r.year}</TableCell>
                        <TableCell>{r.score}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              r.remark === "PASSED"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-300"
                            }
                          >
                            {r.remark}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <RowActions
                            items={[
                              "View transcript",
                              "Print",
                              "Flag for review",
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={resultsPage}
                  totalPages={resultsTotalPages}
                  onPageChange={(p) => setPage("results", p)}
                />
              </GlassCard>
            </TabsContent>

            {/* Admins Table */}
            <TabsContent value="admins" className="mt-4">
              <GlassCard>
                <DataNote>
                  Showing {adminsPageRows.length} of {adminsFiltered.length}{" "}
                  admins
                </DataNote>
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <SortableHead
                        onClick={() => handleSort("admins", "name")}
                      >
                        Name {sortIndicator("admins", "name")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("admins", "role")}
                      >
                        Role {sortIndicator("admins", "role")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("admins", "email")}
                      >
                        Email {sortIndicator("admins", "email")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("admins", "status")}
                      >
                        Status {sortIndicator("admins", "status")}
                      </SortableHead>
                      <SortableHead
                        onClick={() => handleSort("admins", "lastLogin")}
                      >
                        Last Login {sortIndicator("admins", "lastLogin")}
                      </SortableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminsPageRows.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>{a.name}</TableCell>
                        <TableCell>{a.role}</TableCell>
                        <TableCell>{a.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              a.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-300"
                            }
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{a.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <RowActions
                            items={[
                              "Impersonate",
                              "Suspend admin",
                              "Reset password",
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationBar
                  page={adminsPage}
                  totalPages={adminsTotalPages}
                  onPageChange={(p) => setPage("admins", p)}
                />
              </GlassCard>
            </TabsContent>

            {/* Settings placeholder */}
            <TabsContent value="settings" className="mt-4">
              <GlassCard>
                <div className="text-sm text-white/60 space-y-2">
                  <p className="font-medium text-white">
                    School Settings (mock)
                  </p>
                  <p>
                    Here you'll later manage school branding, logo, departments,
                    classes/levels, roll number pattern, admission number
                    pattern, auth policy, maintenance toggle, etc.
                  </p>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          <footer className="mt-8 text-center text-xs text-white/40">
            Powered by{" "}
              <span className="text-blue-400 font-semibold">
                AxWEB Technologies
              </span>{" "}
            ⚡
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Small helpers ---------- */

function NavItem({ href, icon: Icon, children, active }: any) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 transition",
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white"
      )}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/60">{label}</p>
        <span className="text-white/70">{icon}</span>
      </div>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
    >
      {children}
    </motion.div>
  );
}

function DataNote({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-white/50 mb-3">{children}</p>;
}

function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-4 text-xs text-white/60">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 border-white/15 bg-white/[0.03] text-xs"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 border-white/15 bg-white/[0.03] text-xs"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function RowActions({ items }: { items: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/70 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-xs">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((label, idx) => (
          <DropdownMenuItem key={idx}>{label}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortableHead({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 text-xs uppercase tracking-wide text-white/60 hover:text-white"
      >
        {children}
      </button>
    </TableHead>
  );
}