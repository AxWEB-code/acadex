"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  Users,
  BookOpen,
  FileText,
  Key,
  Settings,
  LogOut,
  Menu,
  X,
  Copy,
  RefreshCw,
  Printer,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------ Types ------------ */

type ExamSummary = {
  id: string;
  examTitle: string;
  examCode: string;
  school?: {
    name: string;
  };
};

type ExamPin = {
  id: number;
  pin: string;
  maxUses: number;
  usedCount: number;
  createdAt: string;
};

type InvigilatorToken = {
  id?: number;
  token: string;
  type: string;
  serial?: number;
  expiresAt?: string;
  createdAt?: string;
};

type ResultPin = {
  id?: number;
  pin: string;
  createdAt?: string;
};

type KeyKind = "STUDENT" | "INVIGILATOR" | "RESULT";

export default function AccessKeysPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingPins, setLoadingPins] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [keyKind, setKeyKind] = useState<KeyKind>("STUDENT");

  const [pins, setPins] = useState<ExamPin[]>([]);
  const [invigilatorTokens, setInvigilatorTokens] = useState<InvigilatorToken[]>(
    []
  );
  const [resultPins, setResultPins] = useState<ResultPin[]>([]);

  const [quantity, setQuantity] = useState<string>("50");
  const [maxUses, setMaxUses] = useState<string>("1"); // student pins only
  const [invigilatorType, setInvigilatorType] = useState<string>("NORMAL");
  const [message, setMessage] = useState<string>("");

  /* ------------ Load exams once ------------ */

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoadingExams(true);

        const API = process.env.NEXT_PUBLIC_API_URL;
        const storedUser = localStorage.getItem("acadexUser");
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
          alert("You are not logged in. Please log in again.");
          router.push("/portal");
          return;
        }

        const res = await fetch(`${API}/api/exams?limit=1000`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to load exams:", await res.text());
          setMessage("Failed to load exams.");
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data.data) ? data.data : data.exams || [];

        setExams(list);
      } catch (err) {
        console.error("Load exams error:", err);
        setMessage("Unexpected error loading exams.");
      } finally {
        setLoadingExams(false);
      }
    };

    loadExams();
  }, [router]);

  /* ------------ Load student pins when exam OR kind changes ------------ */

  useEffect(() => {
    // Whenever exam or type changes, clear previous data
    setPins([]);
    setInvigilatorTokens([]);
    setResultPins([]);
    setMessage("");

    if (!selectedExamId) return;

    // Only student pins have a GET list in your backend
    if (keyKind !== "STUDENT") return;

    const loadPins = async () => {
      try {
        setLoadingPins(true);

        const API = process.env.NEXT_PUBLIC_API_URL;
        const storedUser = localStorage.getItem("acadexUser");
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
          alert("You are not logged in. Please log in again.");
          router.push("/portal");
          return;
        }

        const res = await fetch(`${API}/api/exams/${selectedExamId}/pins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to load pins:", await res.text());
          setMessage("Failed to load exam pins.");
          setPins([]);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data.pins) ? data.pins : [];

        setPins(list);
      } catch (err) {
        console.error("Load pins error:", err);
        setMessage("Unexpected error loading exam pins.");
      } finally {
        setLoadingPins(false);
      }
    };

    loadPins();
  }, [selectedExamId, keyKind, router]);

  /* ------------ Generate keys (three types) ------------ */

  const handleGenerateKeys = async () => {
    if (!selectedExamId) {
      alert("Select an exam first.");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty < 1) {
      alert("Enter a valid quantity.");
      return;
    }

    const max = Number(maxUses) || 1;

    try {
      setGenerating(true);
      setMessage("");

      const API = process.env.NEXT_PUBLIC_API_URL;
      const storedUser = localStorage.getItem("acadexUser");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        alert("You are not logged in. Please log in again.");
        router.push("/portal");
        return;
      }

      let url = "";
      let body: any = {};

      if (keyKind === "STUDENT") {
        url = `${API}/api/exams/${selectedExamId}/pins`;
        body = { quantity: qty, maxUses: max };
      } else if (keyKind === "INVIGILATOR") {
        url = `${API}/api/exams/${selectedExamId}/invigilator-tokens`;
        body = {
  quantity: Number(quantity),
  role: invigilatorType,      // e.g. Chief Invigilator
  type: "invigilator"         // REQUIRED keyword for backend
};

      } else {
        // RESULT
        url = `${API}/api/exams/${selectedExamId}/result-pins`;
        body = { quantity: qty };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Generate keys error:", await res.text());
        setMessage("Failed to generate access keys.");
        return;
      }

      const data = await res.json();

      if (keyKind === "STUDENT") {
        const newPins: ExamPin[] = Array.isArray(data.pins)
          ? data.pins
          : Array.isArray(data.keys)
          ? data.keys
          : [];
        setMessage(`Generated ${newPins.length || qty} exam PINs successfully.`);
        // Merge new + old
        setPins((prev) => [...newPins, ...prev]);
      } else if (keyKind === "INVIGILATOR") {
        const newTokens: InvigilatorToken[] = Array.isArray(data.tokens)
          ? data.tokens
          : Array.isArray(data.keys)
          ? data.keys
          : [];
        setMessage(
          `Generated ${newTokens.length || qty} invigilator tokens successfully.`
        );
        setInvigilatorTokens(newTokens);
      } else {
        const newResultPins: ResultPin[] = Array.isArray(data.pins)
          ? data.pins
          : Array.isArray(data.keys)
          ? data.keys
          : [];
        setMessage(
          `Generated ${newResultPins.length || qty} result pins successfully.`
        );
        setResultPins(newResultPins);
      }
    } catch (err) {
      console.error("Generate keys error:", err);
      setMessage("Unexpected error generating access keys.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setMessage(`Copied: ${value}`);
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // Cards for print view (depends on keyKind)
  const cards = (() => {
    if (!selectedExamId) return [];
    if (keyKind === "STUDENT") {
      return pins.map((p, i) => ({
        id: p.id ?? i,
        value: p.pin,
        serial: i + 1,
        createdAt: p.createdAt,
      }));
    }
    if (keyKind === "INVIGILATOR") {
      return invigilatorTokens.map((t, i) => ({
        id: t.id ?? t.serial ?? i,
        value: t.token,
        serial: t.serial ?? i + 1,
        createdAt: t.createdAt,
      }));
    }
    // RESULT
    return resultPins.map((r, i) => ({
      id: r.id ?? i,
      value: r.pin,
      serial: i + 1,
      createdAt: r.createdAt,
    }));
  })();

  const labelForKind = (kind: KeyKind) => {
    if (kind === "STUDENT") return "Student Exam PIN";
    if (kind === "INVIGILATOR") return "Invigilator Token";
    return "Result PIN";
  };

  const descriptionForKind = (kind: KeyKind) => {
    if (kind === "STUDENT")
      return "Generate AX-XXXXXX style exam PINs for students.";
    if (kind === "INVIGILATOR")
      return "Generate INV-XXXXXXXXXX tokens for invigilators / supervisors.";
    return "Generate secure pins students can use to check their results.";
  };

  return (
    <FadeIn>
      <div className="min-h-screen flex bg-gradient-to-b from-[#040509] via-[#060814] to-[#05070f] text-white overflow-hidden">
        {/* Glow layers */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-24 -left-10 w-[420px] h-[420px] bg-blue-700/20 blur-[140px]" />
          <div className="absolute bottom-[-120px] right-[-80px] w-[520px] h-[520px] bg-fuchsia-700/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)]" />
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-white/10 bg-black/40 flex flex-col justify-between transition-transform duration-300 z-40",
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
                  className="rounded-full border border-white/30 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                />
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    AcadeX Console
                  </h2>
                  <p className="text-[11px] text-blue-300/80">
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
              <NavItem href="/superadmin/exams" icon={BookOpen}>
                Exams
              </NavItem>
              <NavItem href="/superadmin/admins" icon={Users}>
                Admin Accounts
              </NavItem>
              <NavItem href="/superadmin/results" icon={FileText}>
                Results
              </NavItem>
              <NavItem href="/superadmin/logs" icon={FileText}>
                Logs & Activities
              </NavItem>
              <NavItem href="/superadmin/keys" icon={Key} active>
                Access Keys
              </NavItem>
              <NavItem href="/superadmin/settings" icon={Settings}>
                Platform Settings
              </NavItem>
            </nav>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs mb-3">
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
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold">Access Keys</h1>
            <Image
              src="/acadex-logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="rounded-full border border-white/30"
            />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6 sm:py-5 shadow-[0_0_40px_rgba(15,23,42,0.9)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6"
          >
            <div className="space-y-1">
              <p className="text-[11px] tracking-[0.2em] uppercase text-blue-300/70">
                Secure Access
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <Key className="text-emerald-400" size={22} />
                Exam Tokens & Access Keys
              </h1>
              <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                Generate exam access PINs, invigilator tokens and result pins —
                then print them as cards to share with centres and students.
              </p>
            </div>

            <div className="flex flex-col items-end text-xs text-white/60">
              {selectedExam ? (
                <>
                  <p className="font-medium text-white/80">
                    Selected exam: {selectedExam.examTitle}
                  </p>
                  <p className="text-[11px] text-white/50">
                    Code: {selectedExam.examCode}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-white/50">
                  Select an exam to manage its keys.
                </p>
              )}
            </div>
          </motion.div>

          {/* Body */}
          <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] gap-4 sm:gap-6 items-start">
            {/* Left: exam selector + generator */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5 space-y-4"
            >
              {/* 1. Exam selector */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/80">
                  Step 1 — Choose Exam
                </p>
                <p className="text-[11px] text-white/60">
                  Pick the exam you want to generate or review keys for.
                </p>
                <Select
                  value={selectedExamId}
                  onValueChange={(value) => setSelectedExamId(value)}
                  disabled={loadingExams}
                >
                  <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
                    <SelectValue
                      placeholder={
                        loadingExams ? "Loading exams..." : "Select an exam"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.examTitle} — {exam.examCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* 2. Key kind selector */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/80">
                  Step 2 — What do you want to generate?
                </p>
                <p className="text-[11px] text-white/60">
                  Choose whether you are generating student access PINs,
                  invigilator tokens or result pins.
                </p>
                <Select
                  value={keyKind}
                  onValueChange={(value) => setKeyKind(value as KeyKind)}
                >
                  <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student Exam PINs</SelectItem>
                    <SelectItem value="INVIGILATOR">
                      Invigilator Tokens
                    </SelectItem>
                    <SelectItem value="RESULT">Result Pins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* 3. Generator form */}
              <div>
                <p className="text-xs font-semibold text-white/80 mb-1">
                  Step 3 — Generate {labelForKind(keyKind)}s
                </p>
                <p className="text-[11px] text-white/60 mb-2">
                  {descriptionForKind(keyKind)}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-white/70">
                      Quantity (how many)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-white/[0.03] border-white/15 text-xs"
                      placeholder="e.g. 200"
                    />
                  </div>

                  {keyKind === "STUDENT" && (
                    <div className="space-y-1">
                      <label className="text-white/70">
                        Max uses per PIN
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={maxUses}
                        onChange={(e) => setMaxUses(e.target.value)}
                        className="bg-white/[0.03] border-white/15 text-xs"
                        placeholder="e.g. 1"
                      />
                      <p className="text-[10px] text-white/40 mt-1">
                        e.g. 1 = single use, 3 = PIN can be reused 3 times.
                      </p>
                    </div>
                  )}

                  {keyKind === "INVIGILATOR" && (
                    <div className="space-y-1">
                      <label className="text-white/70">Invigilator type</label>
                      <Select
                        value={invigilatorType}
                        onValueChange={setInvigilatorType}
                      >
                        <SelectTrigger className="bg-white/[0.03] border-white/15 text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">
                            Normal exam supervision
                          </SelectItem>
                          <SelectItem value="PRACTICAL">
                            Practical supervision
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-white/40 mt-1">
                        This is just a label stored in the token (for your
                        reference).
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="mt-4 w-full text-xs bg-gradient-to-r from-emerald-500 to-blue-500 border-0"
                  disabled={generating || !selectedExamId}
                  onClick={handleGenerateKeys}
                >
                  {generating ? "Generating..." : "Generate"}
                </Button>

                {message && (
                  <p className="mt-3 text-[11px] text-emerald-300">
                    {message}
                  </p>
                )}
              </div>
            </motion.section>

            {/* Right: list + cards */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
            >
              {/* Table / summary */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-white/80">
                    {keyKind === "STUDENT"
                      ? "Generated Exam PINs"
                      : keyKind === "INVIGILATOR"
                      ? "Latest Invigilator Tokens"
                      : "Latest Result Pins"}
                  </p>
                  <p className="text-[11px] text-white/60">
                    {selectedExam
                      ? `For ${selectedExam.examTitle} (${selectedExam.examCode})`
                      : "Select an exam to view its keys."}
                  </p>
                </div>
                {keyKind === "STUDENT" && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white/60 hover:text-white"
                    disabled={loadingPins || !selectedExamId}
                    onClick={() => {
                      // Re-trigger student pin load
                      if (selectedExamId) {
                        setKeyKind("STUDENT");
                        setSelectedExamId((prev) => prev);
                      }
                    }}
                  >
                    <RefreshCw size={16} />
                  </Button>
                )}
              </div>

              {/* Only student pins have full table view from backend */}
              {keyKind === "STUDENT" && (
                <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
                  <div className="grid grid-cols-4 text-[11px] bg-white/[0.06] border-b border-white/10">
                    <div className="px-3 py-2">PIN</div>
                    <div className="px-3 py-2">Usage</div>
                    <div className="px-3 py-2">Created</div>
                    <div className="px-3 py-2 text-right pr-4">Actions</div>
                  </div>

                  {loadingPins && (
                    <div className="p-4 text-xs text-white/60">
                      Loading pins...
                    </div>
                  )}

                  {!loadingPins && pins.length === 0 && (
                    <div className="p-4 text-xs text-white/50">
                      {selectedExamId
                        ? "No pins generated yet for this exam."
                        : "Select an exam to see its pins."}
                    </div>
                  )}

                  {!loadingPins &&
                    pins.map((pin) => {
                      const remaining = pin.maxUses - pin.usedCount;
                      const exhausted = remaining <= 0;
                      return (
                        <div
                          key={pin.id}
                          className="grid grid-cols-4 text-[11px] border-t border-white/10 bg-white/[0.01] hover:bg-white/[0.04] transition"
                        >
                          <div className="px-3 py-2 font-mono text-white/90">
                            {pin.pin}
                          </div>
                          <div className="px-3 py-2 text-white/70">
                            {pin.usedCount} / {pin.maxUses}{" "}
                            {exhausted && (
                              <span className="ml-1 text-rose-300">
                                (exhausted)
                              </span>
                            )}
                          </div>
                          <div className="px-3 py-2 text-white/60">
                            {new Date(pin.createdAt).toLocaleString()}
                          </div>
                          <div className="px-3 py-2 flex justify-end pr-4">
                            <button
                              type="button"
                              onClick={() => handleCopy(pin.pin)}
                              className="inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-blue-100"
                            >
                              <Copy size={12} />
                              Copy
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {keyKind !== "STUDENT" && (
                <p className="text-[11px] text-white/50 mb-4">
                  For invigilator tokens and result pins, this panel shows the{" "}
                  <span className="text-white/70">latest generated batch</span>{" "}
                  in the card view below. You can print/export them directly.
                </p>
              )}

              {/* Printable card view */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-white/80">
                      Printable Cards ({labelForKind(keyKind)})
                    </p>
                    <p className="text-[11px] text-white/60">
                      These cards use Style 1 – exam info + code + QR block +
                      serial. Ideal for printing and sharing.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-[11px] border-white/30 bg-white/[0.04] hover:bg-white/10"
                    disabled={!cards.length}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.print();
                      }
                    }}
                  >
                    <Printer size={14} className="mr-1" />
                    Print / Export cards
                  </Button>
                </div>

                {cards.length === 0 ? (
                  <p className="text-[11px] text-white/50">
                    Generate {labelForKind(keyKind)}s above to see cards here.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cards.map((card, idx) => (
                      <AccessCard
                        key={card.id}
                        examTitle={selectedExam?.examTitle || "Untitled Exam"}
                        examCode={selectedExam?.examCode || "—"}
                        value={card.value}
                        serial={card.serial ?? idx + 1}
                        kindLabel={labelForKind(keyKind)}
                        onCopy={() => handleCopy(card.value)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          <footer className="mt-6 text-center text-[11px] text-white/35">
            Powered by{" "}
            <span className="text-blue-300 font-semibold">
              AxWEB Technologies
            </span>{" "}
            ⚡ — secure access for every exam.
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Small “fake” QR + card (Style 1) ---------- */

function FakeQR() {
  // purely decorative QR-style block
  return (
    <div className="w-12 h-12 rounded bg-white flex items-center justify-center">
      <div className="w-9 h-9 bg-black grid grid-cols-3 grid-rows-3 gap-[2px] p-[2px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-full h-full",
              i % 2 === 0 ? "bg-white" : "bg-black"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function AccessCard({
  examTitle,
  examCode,
  value,
  serial,
  kindLabel,
  onCopy,
}: {
  examTitle: string;
  examCode: string;
  value: string;
  serial: number;
  kindLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="
      rounded-xl 
      border border-blue-500/20 
      bg-gradient-to-br from-[#061229] via-[#04101F] to-[#030A16]
      px-4 py-4 
      shadow-[0_0_30px_rgba(32,106,255,0.35)] 
      text-white
    ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300/90">
          AcadeX Access Card
        </div>
        <div className="text-[10px] text-blue-200/70 font-medium">
          #{serial}
        </div>
      </div>

      {/* Main */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[12px] font-semibold text-blue-200">
            {examTitle}
          </p>
          <p className="text-[11px] text-blue-300/80">
            Code:{" "}
            <span className="font-mono text-blue-100">{examCode}</span>
          </p>
          <p className="text-[10px] text-blue-400/80 mt-1">{kindLabel}</p>

          <p className="mt-2 text-sm font-mono tracking-[0.20em] bg-blue-900/40 px-2 py-1 rounded-lg inline-flex items-center gap-2 border border-blue-700/40">
            {value}
            <button
              type="button"
              onClick={onCopy}
              className="text-[10px] text-blue-300 hover:text-blue-100"
            >
              Copy
            </button>
          </p>
        </div>

        {/* Stylish QR */}
        <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          <FakeQR />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 border-t border-blue-500/20 pt-2 flex items-center justify-between">
        <p className="text-[9px] text-blue-200/60">
          Present this card to the appropriate exam officer.
        </p>
        <p className="text-[9px] text-blue-300 font-medium">
          AxWEB · CBT Secure
        </p>
      </div>
    </div>
  );
}

/* ---------- Reusable Nav Item ---------- */

function NavItem({
  href,
  icon: Icon,
  children,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-white/12 text-white shadow-[0_0_18px_rgba(56,189,248,0.45)] border border-white/15"
          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "size-4",
          active ? "text-sky-300" : "text-white/60"
        )}
      />
      <span>{children}</span>
    </Link>
  );
}
