"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/FadeIn";
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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchJSON } from "@/lib/api";

// ---- Types ----

type ExamMode = "ONLINE" | "OFFLINE" | "";
type Semester = "FIRST" | "SECOND" | "";

type PaperType = "OBJECTIVE" | "THEORY" | "PRACTICAL" | "MIXED" | "";

type ExamBasic = {
  title: string;
  code: string;
  schoolId: string;
  departmentId: string;
  level: string;
  semester: Semester;
  mode: ExamMode;
  startDate: string;
  endDate: string;
  durationMinutes: string; // overall default duration
};

type ObjectiveQuestion = {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correct: "A" | "B" | "C" | "D" | "E" | "";
  marks: string;
};

type TheoryQuestion = {
  id: number;
  text: string;
  marks: string;
};

type Paper = {
  id: number;
  name: string;
  type: PaperType;
  durationMinutes: string;
  totalQuestions: string;
  totalMarks: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;

  // Question builder data per paper
  objectiveQuestions?: ObjectiveQuestion[];
  theoryQuestions?: TheoryQuestion[];
  practicalChecklistFileName?: string;
  practicalObjQuestions?: ObjectiveQuestion[];
};

type ExamSettings = {
  allowBackNavigation: boolean;
  allowReviewBeforeSubmit: boolean;
  showScoreAfterExam: boolean;
  autoSubmitOnTimeout: boolean;
  offlineAllowed: boolean;
  attemptLimit: string;
};

type School = {
  id: number;
  name: string;
  code?: string;
};

type Department = {
  id: number;
  name: string;
};

const TOTAL_STEPS = 5;

// ---- Helpers ----

function generateExamCode(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(Math.random() * 900) + 100; // 100–999
  return `EX-${year}-${rand}`;
}

// ---- Main Page ----

export default function CreateExamPage() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // New: schools & departments
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [basic, setBasic] = useState<ExamBasic>({
    title: "",
    code: "",
    schoolId: "",
    departmentId: "",
    level: "",
    semester: "",
    mode: "",
    startDate: "",
    endDate: "",
    durationMinutes: "",
  });

  const [papers, setPapers] = useState<Paper[]>([
    {
      id: 1,
      name: "Paper 1",
      type: "OBJECTIVE",
      durationMinutes: "",
      totalQuestions: "",
      totalMarks: "",
      shuffleQuestions: true,
      shuffleOptions: true,
      negativeMarking: false,
      objectiveQuestions: [],
      theoryQuestions: [],
      practicalObjQuestions: [],
    },
  ]);

  const [settings, setSettings] = useState<ExamSettings>({
    allowBackNavigation: true,
    allowReviewBeforeSubmit: true,
    showScoreAfterExam: false,
    autoSubmitOnTimeout: true,
    offlineAllowed: false,
    attemptLimit: "1",
  });

  const [notes, setNotes] = useState("");

  // Generate default exam code on mount if empty
  useEffect(() => {
    setBasic((prev) =>
      prev.code
        ? prev
        : {
            ...prev,
            code: generateExamCode(),
          }
    );
  }, []);

  // Load schools
  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await fetchJSON("/api/superadmin/schools");
        // expect { schools: [...] } or plain array
        const list = Array.isArray(data) ? data : data.schools || [];
        setSchools(list);
      } catch (err) {
        console.error("Failed to load schools", err);
      }
    }
    loadSchools();
  }, []);

  // Load departments whenever school changes
  useEffect(() => {
    if (!basic.schoolId) {
      setDepartments([]);
      setBasic((prev) => ({ ...prev, departmentId: "" }));
      return;
    }

    async function loadDepartments() {
      try {
        const data = await fetchJSON(
          `/api/superadmin/schools/${basic.schoolId}/departments`
        );
        const list = Array.isArray(data) ? data : data.departments || [];
        setDepartments(list);
      } catch (err) {
        console.error("Failed to load departments", err);
        setDepartments([]);
      }
    }

    loadDepartments();
  }, [basic.schoolId]);

  // ---- Step navigation guards ----

  const canGoNext = (() => {
    if (step === 1) {
      return (
        basic.title.trim() &&
        basic.code.trim() &&
        basic.schoolId &&
        basic.departmentId &&
        basic.mode &&
        basic.startDate &&
        basic.endDate
      );
    }
    if (step === 2) {
      return papers.length > 0 && papers.every((p) => p.name.trim() && p.type);
    }
    // Step 3 (Question builder) – always allow for now
    if (step === 3) return true;
    // Step 4 – settings: always valid
    if (step === 4) return true;
    return true;
  })();

  const handleNext = () => {
    if (step < TOTAL_STEPS && canGoNext) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const totalQuestions = papers.reduce(
    (sum, p) => sum + (p.totalQuestions ? Number(p.totalQuestions) || 0 : 0),
    0
  );
  const totalMarks = papers.reduce(
    (sum, p) => sum + (p.totalMarks ? Number(p.totalMarks) || 0 : 0),
    0
  );

  const handleAddPaper = () => {
    setPapers((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        name: `Paper ${prev.length + 1}`,
        type: "OBJECTIVE",
        durationMinutes: "",
        totalQuestions: "",
        totalMarks: "",
        shuffleQuestions: true,
        shuffleOptions: true,
        negativeMarking: false,
        objectiveQuestions: [],
        theoryQuestions: [],
        practicalObjQuestions: [],
      },
    ]);
  };

  const handleRemovePaper = (id: number) => {
    if (papers.length === 1) return;
    setPapers((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePaperChange = <K extends keyof Paper>(
    id: number,
    key: K,
    value: Paper[K]
  ) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const handleSubmit = async () => {
  setSubmitting(true);

  try {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const payload = { basic, papers, settings, notes };

    const res = await fetch(`${API}/api/superadmin/exams/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Exam creation error:", err);
      alert("Failed to create exam!");
      return;
    }

    const data = await res.json();
    console.log("Exam created:", data);

    router.push("/superadmin/exams");

  } catch (err) {
    console.error(err);
    alert("Failed to create exam.");
  } finally {
    setSubmitting(false);
  }
};


  // Progress percentage
  const progress = (step / TOTAL_STEPS) * 100;

  // Helpers for labels
  const selectedSchool = schools.find(
    (s) => String(s.id) === String(basic.schoolId)
  );
  const selectedDepartment = departments.find(
    (d) => String(d.id) === String(basic.departmentId)
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
              <NavItem href="/superadmin/schools" icon={Building2}>
                Schools
              </NavItem>
              <NavItem href="/superadmin/exams" icon={BookOpen} active>
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
              © {new Date().getFullYear()} AcadeX Console
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 max-w-full overflow-x-hidden">
          {/* Mobile topbar */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold">Create Exam</h1>
            <Image
              src="/acadex-logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-full border border-white/20"
            />
          </div>

          {/* Header + progress */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6 shadow-xl mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-blue-300/80 font-medium uppercase tracking-wide mb-1">
                  Exam Creation Wizard
                </p>
                <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                  <BookOpen className="text-blue-400" />
                  Create New Exam
                </h1>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                  Configure exam details, papers, questions and security — all
                  in one smooth flow.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-white/60">
                  Step {step} of {TOTAL_STEPS}
                </p>
                <div className="w-full sm:w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step pills */}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              {["Basics", "Papers", "Questions", "Settings", "Review"].map(
                (label, idx) => {
                  const stepIndex = idx + 1;
                  const active = step === stepIndex;
                  const done = stepIndex < step;
                  return (
                    <div
                      key={label}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-xs flex items-center gap-1",
                        done
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                          : active
                          ? "border-blue-500/70 bg-blue-500/10 text-blue-200"
                          : "border-white/10 bg-white/[0.03] text-white/50"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-current" />
                      )}
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{stepIndex}</span>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>

          {/* Wizard body */}
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-4 sm:gap-6 items-start">
            {/* Left: steps */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-md"
            >
              {step === 1 && (
                <Step1Basics
                  basic={basic}
                  setBasic={setBasic}
                  schools={schools}
                  departments={departments}
                />
              )}

              {step === 2 && (
                <Step2Papers
                  papers={papers}
                  onAddPaper={handleAddPaper}
                  onRemovePaper={handleRemovePaper}
                  onChangePaper={handlePaperChange}
                />
              )}

              {step === 3 && (
                <Step3Questions
                  papers={papers}
                  setPapers={setPapers}
                />
              )}

              {step === 4 && (
                <Step4Settings
                  settings={settings}
                  setSettings={setSettings}
                  notes={notes}
                  setNotes={setNotes}
                />
              )}

              {step === 5 && (
                <Step5Review
                  basic={basic}
                  papers={papers}
                  settings={settings}
                  notes={notes}
                  totalQuestions={totalQuestions}
                  totalMarks={totalMarks}
                  schoolName={selectedSchool?.name || ""}
                  departmentName={selectedDepartment?.name || ""}
                />
              )}

              {/* Bottom nav buttons */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  disabled={step === 1}
                  onClick={handleBack}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  {step < TOTAL_STEPS && (
                    <Button
                      type="button"
                      size="sm"
                      className="text-xs bg-gradient-to-r from-blue-500 to-fuchsia-600 border-0"
                      disabled={!canGoNext}
                      onClick={handleNext}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                  {step === TOTAL_STEPS && (
                    <Button
                      type="button"
                      size="sm"
                      className="text-xs bg-gradient-to-r from-emerald-500 to-blue-500 border-0"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Publishing..." : "Publish Exam"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: live summary */}
            <motion.aside
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-4"
            >
              <p className="text-xs text-white/50 mb-1">Live Summary</p>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                <p className="text-sm font-semibold">
                  {basic.title || "Untitled Exam"}
                </p>
                <p className="text-xs text-white/50">
                  Code:{" "}
                  <span className="text-white/80">
                    {basic.code || "—"}
                  </span>
                </p>
                <p className="text-xs text-white/50">
                  School:{" "}
                  <span className="text-white/80">
                    {selectedSchool?.name || "Not set"}
                  </span>
                </p>
                <p className="text-xs text-white/50">
                  Department:{" "}
                  <span className="text-white/80">
                    {selectedDepartment?.name || "Not set"}
                  </span>
                </p>
                <p className="text-xs text-white/50">
                  Level / Class:{" "}
                  <span className="text-white/80">
                    {basic.level || "Not set"}
                  </span>
                </p>
                <p className="text-xs text-white/50">
                  Semester:{" "}
                  <span className="text-white/80">
                    {basic.semester === "FIRST"
                      ? "1st Semester"
                      : basic.semester === "SECOND"
                      ? "2nd Semester"
                      : "Not set"}
                  </span>
                </p>
                <p className="text-xs text-white/50">
                  Mode:{" "}
                  <span className="text-white/80">
                    {basic.mode || "Not set"}
                  </span>
                </p>
                {(basic.startDate || basic.endDate) && (
                  <p className="text-xs text-white/50">
                    Window:{" "}
                    <span className="text-white/80">
                      {basic.startDate || "?"} → {basic.endDate || "?"}
                    </span>
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Papers</span>
                  <span className="text-white/80">{papers.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Total Questions (declared)</span>
                  <span className="text-white/80">{totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Total Marks (declared)</span>
                  <span className="text-white/80">{totalMarks}</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-1 text-xs text-white/60">
                <p className="font-medium text-white">
                  Settings Snapshot
                </p>
                <p>
                  Back navigation:{" "}
                  <span className="text-white/80">
                    {settings.allowBackNavigation ? "Allowed" : "Not allowed"}
                  </span>
                </p>
                <p>
                  Review before submit:{" "}
                  <span className="text-white/80">
                    {settings.allowReviewBeforeSubmit ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  Show score after exam:{" "}
                  <span className="text-white/80">
                    {settings.showScoreAfterExam ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  Offline allowed:{" "}
                  <span className="text-white/80">
                    {settings.offlineAllowed ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </motion.aside>
          </div>

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

/* ---------- Steps ---------- */

function Step1Basics({
  basic,
  setBasic,
  schools,
  departments,
}: {
  basic: ExamBasic;
  setBasic: React.Dispatch<React.SetStateAction<ExamBasic>>;
  schools: School[];
  departments: Department[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold mb-1">
        Step 1 — Basic Information
      </h2>
      <p className="text-xs text-white/60 mb-3">
        Attach this exam to a school, pick department, and define timing.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/70">School *</label>
          <Select
            value={basic.schoolId}
            onValueChange={(value) =>
              setBasic((prev) => ({
                ...prev,
                schoolId: value,
                departmentId: "",
              }))
            }
          >
            <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
              <SelectValue placeholder="Select school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name} {s.code ? `(${s.code})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Department *</label>
          <Select
            value={basic.departmentId}
            onValueChange={(value) =>
              setBasic((prev) => ({ ...prev, departmentId: value }))
            }
            disabled={!basic.schoolId || departments.length === 0}
          >
            <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
              <SelectValue
                placeholder={
                  !basic.schoolId
                    ? "Select school first"
                    : departments.length === 0
                    ? "No department found"
                    : "Select department"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Level / Class</label>
          <Input
            value={basic.level}
            onChange={(e) =>
              setBasic((prev) => ({ ...prev, level: e.target.value }))
            }
            placeholder="e.g. ND2, 300L, SS2"
            className="bg-white/[0.03] border-white/15 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Semester</label>
          <Select
            value={basic.semester}
            onValueChange={(value: Semester) =>
              setBasic((prev) => ({ ...prev, semester: value }))
            }
          >
            <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIRST">1st Semester</SelectItem>
              <SelectItem value="SECOND">2nd Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Exam Title *</label>
          <Input
            value={basic.title}
            onChange={(e) =>
              setBasic((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. Promotional Exam 2025 (Year 2 → Year 3)"
            className="bg-white/[0.03] border-white/15 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Exam Code *</label>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/15 rounded-md px-3 py-2 text-xs">
  <span className="flex-1 text-white/80">{basic.code || "Generating..."}</span>

  <button
    type="button"
    onClick={() => navigator.clipboard.writeText(basic.code)}
    className="text-blue-300 hover:text-blue-200"
  >
    Copy
  </button>
</div>

        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">Mode *</label>
          <Select
            value={basic.mode}
            onValueChange={(value: ExamMode) =>
              setBasic((prev) => ({ ...prev, mode: value }))
            }
          >
            <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="OFFLINE">Offline (local / sync later)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70">
            Default Duration (minutes)
          </label>
          <Input
            type="number"
            min={0}
            value={basic.durationMinutes}
            onChange={(e) =>
              setBasic((prev) => ({
                ...prev,
                durationMinutes: e.target.value,
              }))
            }
            placeholder="e.g. 90"
            className="bg-white/[0.03] border-white/15 text-xs"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/70">Start Date *</label>
          <Input
            type="datetime-local"
            value={basic.startDate}
            onChange={(e) =>
              setBasic((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="bg-white/[0.03] border-white/15 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">End Date *</label>
          <Input
            type="datetime-local"
            value={basic.endDate}
            onChange={(e) =>
              setBasic((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="bg-white/[0.03] border-white/15 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

function Step2Papers({
  papers,
  onAddPaper,
  onRemovePaper,
  onChangePaper,
}: {
  papers: Paper[];
  onAddPaper: () => void;
  onRemovePaper: (id: number) => void;
  onChangePaper: <K extends keyof Paper>(
    id: number,
    key: K,
    value: Paper[K]
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold mb-1">Step 2 — Papers Setup</h2>
      <p className="text-xs text-white/60 mb-3">
        Split the exam into one or more papers — objective, theory or
        practical.
      </p>

      <div className="space-y-3">
        {papers.map((paper, index) => (
          <div
            key={paper.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-white/80">
                Paper {index + 1}
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                {papers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemovePaper(paper.id)}
                    className="text-rose-300 hover:text-rose-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-white/70">Paper Name</label>
                <Input
                  value={paper.name}
                  onChange={(e) =>
                    onChangePaper(paper.id, "name", e.target.value)
                  }
                  placeholder="e.g. Paper 1 — Objective"
                  className="bg-white/[0.03] border-white/15 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">Type</label>
                <Select
                  value={paper.type}
                  onValueChange={(value: PaperType) =>
                    onChangePaper(paper.id, "type", value)
                  }
                >
                  <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OBJECTIVE">Objective</SelectItem>
                    <SelectItem value="THEORY">Theory</SelectItem>
                    <SelectItem value="PRACTICAL">Practical (Checklist + OBJ)</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-white/70">Duration (minutes)</label>
                <Input
                  type="number"
                  min={0}
                  value={paper.durationMinutes}
                  onChange={(e) =>
                    onChangePaper(
                      paper.id,
                      "durationMinutes",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 60"
                  className="bg-white/[0.03] border-white/15 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">
                  Total Questions (declared)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={paper.totalQuestions}
                  onChange={(e) =>
                    onChangePaper(
                      paper.id,
                      "totalQuestions",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 50"
                  className="bg-white/[0.03] border-white/15 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">
                  Total Marks (declared)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={paper.totalMarks}
                  onChange={(e) =>
                    onChangePaper(paper.id, "totalMarks", e.target.value)
                  }
                  placeholder="e.g. 100"
                  className="bg-white/[0.03] border-white/15 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">Options</label>
                <div className="flex flex-wrap gap-2 text-[11px] text-white/70">
                  <button
                    type="button"
                    onClick={() =>
                      onChangePaper(
                        paper.id,
                        "shuffleQuestions",
                        !paper.shuffleQuestions
                      )
                    }
                    className={cn(
                      "px-2 py-1 rounded-full border border-white/15 bg-white/[0.02]",
                      paper.shuffleQuestions &&
                        "border-blue-400/70 bg-blue-500/10 text-blue-100"
                    )}
                  >
                    Shuffle questions
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangePaper(
                        paper.id,
                        "shuffleOptions",
                        !paper.shuffleOptions
                      )
                    }
                    className={cn(
                      "px-2 py-1 rounded-full border border-white/15 bg-white/[0.02]",
                      paper.shuffleOptions &&
                        "border-blue-400/70 bg-blue-500/10 text-blue-100"
                    )}
                  >
                    Shuffle options
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChangePaper(
                        paper.id,
                        "negativeMarking",
                        !paper.negativeMarking
                      )
                    }
                    className={cn(
                      "px-2 py-1 rounded-full border border-white/15 bg-white/[0.02]",
                      paper.negativeMarking &&
                        "border-rose-400/70 bg-rose-500/10 text-rose-100"
                    )}
                  >
                    Negative marking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 border-dashed border-white/25 bg-white/[0.02] text-xs"
        onClick={onAddPaper}
      >
        <Plus className="w-3 h-3 mr-1" />
        Add another paper
      </Button>
    </div>
  );
}

function Step3Questions({
  papers,
  setPapers,
}: {
  papers: Paper[];
  setPapers: React.Dispatch<React.SetStateAction<Paper[]>>;
}) {
  const updatePaper = (paperId: number, updater: (p: Paper) => Paper) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? updater(p) : p))
    );
  };

  const handleAddObjectiveQuestion = (paperId: number, isPractical = false) => {
    updatePaper(paperId, (p) => {
      const key = isPractical ? "practicalObjQuestions" : "objectiveQuestions";
      const list = (p[key] as ObjectiveQuestion[]) || [];
      const nextId = list.length ? list[list.length - 1].id + 1 : 1;
      return {
        ...p,
        [key]: [
          ...list,
          {
            id: nextId,
            text: "",
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
            optionE: "",
            correct: "",
            marks: "",
          },
        ],
      };
    });
  };

  const handleObjectiveChange = (
    paperId: number,
    questionId: number,
    field: keyof ObjectiveQuestion,
    value: ObjectiveQuestion[keyof ObjectiveQuestion],
    isPractical = false
  ) => {
    updatePaper(paperId, (p) => {
      const key = isPractical ? "practicalObjQuestions" : "objectiveQuestions";
      const list = (p[key] as ObjectiveQuestion[]) || [];
      return {
        ...p,
        [key]: list.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      };
    });
  };

  const handleRemoveObjective = (
    paperId: number,
    questionId: number,
    isPractical = false
  ) => {
    updatePaper(paperId, (p) => {
      const key = isPractical ? "practicalObjQuestions" : "objectiveQuestions";
      const list = (p[key] as ObjectiveQuestion[]) || [];
      return {
        ...p,
        [key]: list.filter((q) => q.id !== questionId),
      };
    });
  };

  const handleAddTheoryQuestion = (paperId: number) => {
    updatePaper(paperId, (p) => {
      const list = p.theoryQuestions || [];
      const nextId = list.length ? list[list.length - 1].id + 1 : 1;
      return {
        ...p,
        theoryQuestions: [
          ...list,
          { id: nextId, text: "", marks: "" },
        ],
      };
    });
  };

  const handleTheoryChange = (
    paperId: number,
    questionId: number,
    field: keyof TheoryQuestion,
    value: TheoryQuestion[keyof TheoryQuestion]
  ) => {
    updatePaper(paperId, (p) => {
      const list = p.theoryQuestions || [];
      return {
        ...p,
        theoryQuestions: list.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      };
    });
  };

  const handleRemoveTheory = (paperId: number, questionId: number) => {
    updatePaper(paperId, (p) => {
      const list = p.theoryQuestions || [];
      return {
        ...p,
        theoryQuestions: list.filter((q) => q.id !== questionId),
      };
    });
  };

  const handleChecklistUpload = (paperId: number, file: File | null) => {
    updatePaper(paperId, (p) => ({
      ...p,
      practicalChecklistFileName: file ? file.name : undefined,
    }));
    // Later: send file to backend for parsing.
  };

  const handleObjUpload = async (paperId: number, file: File | null) => {
  if (!file) return;

  try {
   const API = process.env.NEXT_PUBLIC_API_URL;

    const formData = new FormData();
formData.append("file", file);

const res = await fetch(`${API}/api/superadmin/exams/parse-obj`, {
  method: "POST",
  body: formData,
});

    if (!res.ok) {
      alert("Failed to parse OBJ file (API error).");
      return;
    }

    const data = await res.json();
    const parsedQuestions = data.questions || [];
    const warnings = data.warnings || [];

    // 🔥 FIXED UPDATE LOGIC
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id !== paperId) return p;

        const formatted = parsedQuestions.map((q: any, i: number) => ({
          id: i + 1,
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          optionE: q.optionE,
          correct: q.correct,
          marks: "",
        }));

        if (p.type === "PRACTICAL") {
          return { ...p, practicalObjQuestions: formatted };
        }

        return { ...p, objectiveQuestions: formatted };
      })
    );

    if (warnings.length) {
      alert("Parsed with warnings:\n" + warnings.slice(0, 5).join("\n"));
    } else {
      alert(`Loaded ${parsedQuestions.length} questions successfully!`);
    }
  } catch (err) {
    console.error("OBJ upload error:", err);
    alert("Unexpected error while uploading file.");
  }
};




  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold mb-1">
        Step 3 — Question Builder
      </h2>
      <p className="text-xs text-white/60 mb-3">
        Build questions per paper. For objective, you can type manually or
        upload a file. Practical combines checklist (supervisor) + OBJ.
      </p>

      <div className="space-y-4">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/80">
                {paper.name || "Paper"} —{" "}
                <span className="text-white/60">
                  {paper.type || "Type not set"}
                </span>
              </p>
            </div>

            {/* OBJECTIVE */}
            {(paper.type === "OBJECTIVE" ||
              paper.type === "MIXED" ||
              paper.type === "PRACTICAL") && (
              <div className="space-y-3">
                <p className="text-[11px] text-white/60 font-medium">
                  Objective Questions{" "}
                  {paper.type === "PRACTICAL" && "(Linked to practical)"}
                </p>

                {/* Upload block */}
                <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.02] p-3 text-[11px] text-white/60 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Upload className="w-3 h-3" />
                    <span>
                      Upload OBJ file (Word / CSV / Excel) to auto-generate
                      questions (backend parsing later).
                    </span>
                  </div>
                  <input
  type="file"
  name="file"
  accept=".csv,.xlsx,.xls,.docx,.txt"
  onChange={(e) => handleObjUpload(paper.id, e.target.files?.[0] || null)}
/>

                </div>

                {/* Manual builder */}
                <div className="space-y-2">
                  {(
                    (paper.type === "PRACTICAL"
                      ? paper.practicalObjQuestions
                      : paper.objectiveQuestions) || []
                  ).map((q) => (
                    <div
                      key={q.id}
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-white/70">
                          Question {q.id}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveObjective(
                              paper.id,
                              q.id,
                              paper.type === "PRACTICAL"
                            )
                          }
                          className="text-rose-300 hover:text-rose-200 text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                      <Input
                        value={q.text}
                        onChange={(e) =>
                          handleObjectiveChange(
                            paper.id,
                            q.id,
                            "text",
                            e.target.value,
                            paper.type === "PRACTICAL"
                          )
                        }
                        placeholder="Question text"
                        className="bg-white/[0.03] border-white/15 text-xs"
                      />
                      <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                        {["A", "B", "C", "D", "E"].map((opt) => {
                          const field =
                            ("option" + opt) as keyof ObjectiveQuestion;
                          return (
                            <Input
                              key={opt}
                              value={q[field] as string}
                              onChange={(e) =>
                                handleObjectiveChange(
                                  paper.id,
                                  q.id,
                                  field,
                                  e.target.value,
                                  paper.type === "PRACTICAL"
                                )
                              }
                              placeholder={`Option ${opt}`}
                              className="bg-white/[0.03] border-white/15 text-xs"
                            />
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center text-[11px]">
                        <div className="flex items-center gap-1">
                          <span className="text-white/60">
                            Correct option:
                          </span>
                          <Select
                            value={q.correct}
                            onValueChange={(value) =>
                              handleObjectiveChange(
                                paper.id,
                                q.id,
                                "correct",
                                value as ObjectiveQuestion["correct"],
                                paper.type === "PRACTICAL"
                              )
                            }
                          >
                            <SelectTrigger className="h-7 w-24 bg-white/[0.03] border-white/15 text-[11px]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {["A", "B", "C", "D", "E"].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white/60">Marks:</span>
                          <Input
                            type="number"
                            min={0}
                            value={q.marks}
                            onChange={(e) =>
                              handleObjectiveChange(
                                paper.id,
                                q.id,
                                "marks",
                                e.target.value,
                                paper.type === "PRACTICAL"
                              )
                            }
                            className="h-7 w-20 bg-white/[0.03] border-white/15 text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-dashed border-white/25 bg-white/[0.02] text-[11px]"
                    onClick={() =>
                      handleAddObjectiveQuestion(
                        paper.id,
                        paper.type === "PRACTICAL"
                      )
                    }
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add objective question
                  </Button>
                </div>
              </div>
            )}

            {/* THEORY */}
            {(paper.type === "THEORY" || paper.type === "MIXED") && (
              <div className="space-y-3 mt-4">
                <p className="text-[11px] text-white/60 font-medium">
                  Theory Questions
                </p>
                <div className="space-y-2">
                  {(paper.theoryQuestions || []).map((q) => (
                    <div
                      key={q.id}
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-white/70">
                          Question {q.id}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveTheory(paper.id, q.id)
                          }
                          className="text-rose-300 hover:text-rose-200 text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={q.text}
                        onChange={(e) =>
                          handleTheoryChange(
                            paper.id,
                            q.id,
                            "text",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Theory question text..."
                        className="w-full bg-white/[0.03] border border-white/15 rounded-md text-xs p-2 resize-y"
                      />
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-white/60">Marks:</span>
                        <Input
                          type="number"
                          min={0}
                          value={q.marks}
                          onChange={(e) =>
                            handleTheoryChange(
                              paper.id,
                              q.id,
                              "marks",
                              e.target.value
                            )
                          }
                          className="h-7 w-20 bg-white/[0.03] border-white/15 text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-dashed border-white/25 bg-white/[0.02] text-[11px]"
                    onClick={() => handleAddTheoryQuestion(paper.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add theory question
                  </Button>
                </div>
              </div>
            )}

            {/* PRACTICAL CHECKLIST */}
            {paper.type === "PRACTICAL" && (
              <div className="space-y-3 mt-4">
                <p className="text-[11px] text-white/60 font-medium">
                  Practical Checklist (Supervisor)
                </p>
                <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.02] p-3 text-[11px] text-white/60 space-y-2">
                  <p>
                    Upload the checklist file that supervisors will use during
                    the practical. Later, we&apos;ll build the supervisor
                    dashboard to tick items live.
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.xls,.docx"
                    className="text-[11px]"
                    onChange={(e) =>
                      handleChecklistUpload(
                        paper.id,
                        e.target.files?.[0] || null
                      )
                    }
                  />
                  {paper.practicalChecklistFileName && (
                    <p className="text-[11px] text-emerald-300 mt-1">
                      Uploaded: {paper.practicalChecklistFileName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4Settings({
  settings,
  setSettings,
  notes,
  setNotes,
}: {
  settings: ExamSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExamSettings>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}) {
  const toggle = (key: keyof ExamSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold mb-1">
        Step 4 — Exam Behaviour & Policies
      </h2>
      <p className="text-xs text-white/60 mb-3">
        Fine-tune how students interact with this exam and how results behave.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <ToggleRow
          label="Allow back navigation between questions"
          checked={settings.allowBackNavigation}
          onToggle={() => toggle("allowBackNavigation")}
        />
        <ToggleRow
          label="Allow review page before final submission"
          checked={settings.allowReviewBeforeSubmit}
          onToggle={() => toggle("allowReviewBeforeSubmit")}
        />
        <ToggleRow
          label="Show score immediately after exam"
          checked={settings.showScoreAfterExam}
          onToggle={() => toggle("showScoreAfterExam")}
        />
        <ToggleRow
          label="Auto-submit when time runs out"
          checked={settings.autoSubmitOnTimeout}
          onToggle={() => toggle("autoSubmitOnTimeout")}
        />
        <ToggleRow
          label="This exam can run in offline centres"
          checked={settings.offlineAllowed}
          onToggle={() => toggle("offlineAllowed")}
        />

        <div className="space-y-1">
          <label className="text-white/70">Attempt limit per student</label>
          <Input
            type="number"
            min={1}
            value={settings.attemptLimit}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                attemptLimit: e.target.value,
              }))
            }
            placeholder="e.g. 1"
            className="bg-white/[0.03] border-white/15 text-xs"
          />
          <p className="text-[11px] text-white/40">
            For CBT exams this is usually 1. You can increase for practice
            exams.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-white/70">
          Internal notes (SuperAdmin / invigilators only)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="e.g. First pilot of promotion exam with offline mode — monitor carefully."
          className="w-full bg-white/[0.03] border border-white/15 rounded-md text-xs p-2 resize-y"
        />
      </div>
    </div>
  );
}

function Step5Review({
  basic,
  papers,
  settings,
  notes,
  totalQuestions,
  totalMarks,
  schoolName,
  departmentName,
}: {
  basic: ExamBasic;
  papers: Paper[];
  settings: ExamSettings;
  notes: string;
  totalQuestions: number;
  totalMarks: number;
  schoolName: string;
  departmentName: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold mb-1">
        Step 5 — Review & Publish
      </h2>
      <p className="text-xs text-white/60 mb-3">
        Confirm the summary below before publishing. You can still adjust later.
      </p>

      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3">
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
            <p className="text-[11px] font-medium text-white/80">
              Basic Info
            </p>
            <Row label="Title" value={basic.title || "—"} />
            <Row label="Code" value={basic.code || "—"} />
            <Row label="School" value={schoolName || "—"} />
            <Row label="Department" value={departmentName || "—"} />
            <Row label="Level / Class" value={basic.level || "—"} />
            <Row
              label="Semester"
              value={
                basic.semester === "FIRST"
                  ? "1st Semester"
                  : basic.semester === "SECOND"
                  ? "2nd Semester"
                  : "—"
              }
            />
            <Row label="Mode" value={basic.mode || "—"} />
            <Row
              label="Default duration"
              value={
                basic.durationMinutes
                  ? `${basic.durationMinutes} minutes`
                  : "—"
              }
            />
            <Row
              label="Window"
              value={
                basic.startDate || basic.endDate
                  ? `${basic.startDate || "?"} → ${
                      basic.endDate || "?"
                    }`
                  : "—"
              }
            />
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
            <p className="text-[11px] font-medium text-white/80">
              Papers Summary
            </p>
            <Row label="Total papers" value={papers.length.toString()} />
            <Row
              label="Total questions (declared)"
              value={totalQuestions.toString()}
            />
            <Row label="Total marks (declared)" value={totalMarks.toString()} />
          </section>
        </div>

        <div className="space-y-3">
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <p className="text-[11px] font-medium text-white/80">
              Papers Detail
            </p>
            <div className="space-y-2">
              {papers.map((p, i) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
                >
                  <p className="text-xs font-semibold text-white/80">
                    {i + 1}. {p.name || "Paper"}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">
                    Type: {p.type || "—"}
                  </p>
                  <p className="text-[11px] text-white/60">
                    Duration:{" "}
                    {p.durationMinutes
                      ? `${p.durationMinutes} mins`
                      : "—"}
                  </p>
                  <p className="text-[11px] text-white/60">
                    Declared Questions: {p.totalQuestions || "—"} | Declared
                    Marks: {p.totalMarks || "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
            <p className="text-[11px] font-medium text-white/80">
              Behaviour & Policies
            </p>
            <Row
              label="Back navigation"
              value={settings.allowBackNavigation ? "Allowed" : "Not allowed"}
            />
            <Row
              label="Review before submit"
              value={
                settings.allowReviewBeforeSubmit ? "Enabled" : "Disabled"
              }
            />
            <Row
              label="Show score after exam"
              value={settings.showScoreAfterExam ? "Yes" : "No"}
            />
            <Row
              label="Auto-submit on timeout"
              value={settings.autoSubmitOnTimeout ? "Yes" : "No"}
            />
            <Row
              label="Offline allowed"
              value={settings.offlineAllowed ? "Yes" : "No"}
            />
            <Row
              label="Attempt limit"
              value={settings.attemptLimit || "1"}
            />
          </section>

          {notes && (
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
              <p className="text-[11px] font-medium text-white/80">
                Internal Notes
              </p>
              <p className="text-[11px] text-white/70 whitespace-pre-wrap">
                {notes}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small shared helpers ---------- */

function NavItem({
  href,
  icon: Icon,
  children,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 transition",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/[0.07] hover:text-white"
      )}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2">
      <p className="text-[11px] text-white/70">{label}</p>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors",
          checked ? "bg-emerald-500/80" : "bg-white/20"
        )}
      >
        <span
          className={cn(
            "w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] text-white/60">
      <span>{label}</span>
      <span className="text-white/80 text-right">{value}</span>
    </div>
  );
}
