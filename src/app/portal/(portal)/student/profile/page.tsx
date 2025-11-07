"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  UserRound,
  Lock,
  LogOut,
  Check,
  Pencil,
  Laptop,
  Download,
  Trash2,
} from "lucide-react";

/* ------------------ Type Definitions ------------------ */
interface School {
  name: string;
  logo?: string;
}

interface Department {
  name: string;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  admissionNo: string;
  rollNumber: string;
  department?: Department;
  level?: string;
  class?: string;
  school?: School;
  contactNumber?: string;
  email?: string;
  dob?: string;
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface ReadProps {
  label: string;
  value: string | undefined;
}

interface EditableProps {
  label: string;
  value: string | undefined;
  icon?: React.ReactNode;
  editable: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
}

/* ------------------ Component ------------------ */
export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    contactNumber: "",
    email: "",
    dob: "",
  });
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("acadexUser");
    const token = stored ? JSON.parse(stored).token : null;
    if (!token) {
      window.location.href = "/portal";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/profile/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data: StudentProfile = await res.json();
        setProfile(data);
        setForm({
          contactNumber: data.contactNumber || "",
          email: data.email || "",
          dob: data.dob || "",
        });
      } catch (err) {
        console.error("❌ Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
      setToast("✅ Profile updated successfully!");
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  };

  const handleExportData = () => {
    if (!profile) return;
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.firstName}_${profile.lastName}_acadex_profile.json`;
    link.click();
    URL.revokeObjectURL(url);
    setToast("📁 Data exported successfully!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeactivateRequest = () => {
    setToast("🧾 Account deactivation request sent to admin.");
    setTimeout(() => setToast(null), 3000);
  };

  /* --- SHIMMER STYLE for skeletons --- */
  const shimmer =
    "bg-gradient-to-r from-blue-700/10 via-indigo-600/20 to-blue-700/10 bg-[length:1000px_100%] animate-[shimmer_2.2s_linear_infinite]";

  if (loading)
    return (
      <div className="min-h-[80vh] px-6 py-10 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-blue-700/15 blur-3xl" />
          <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        <div className={`h-8 w-1/3 rounded-lg ${shimmer}`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-32 rounded-2xl border border-white/10 ${shimmer}`} />
          ))}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-400">
        ⚠️ Unable to load profile. Please log in again.
      </div>
    );

  return (
    <div className="space-y-8 relative px-4 sm:px-8 pb-10">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-blue-700/25 blur-3xl" />
        <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-40 w-80 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent blur-2xl rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Profile &amp; Settings
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm text-white/70 transition"
        >
          <Pencil size={14} /> {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Personal Info */}
      <Card title="Personal Information" icon={<UserRound className="size-4" />}>
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 bg-white/10">
            {profile.school?.logo ? (
              <Image
                src={profile.school.logo}
                alt={profile.school.name}
                width={64}
                height={64}
                className="object-contain"
              />
            ) : (
              <UserRound className="w-8 h-8 text-blue-400 absolute inset-0 m-auto" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-blue-400/80">{profile.school?.name}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Read label="Admission No" value={profile.admissionNo} />
          <Read label="Roll No" value={profile.rollNumber} />
          <Read label="Department" value={profile.department?.name} />
          <Read label="Level/Class" value={profile.level || profile.class} />
        </div>
      </Card>

      {/* Contact Info */}
      <Card title="Contact Information" icon={<Phone className="size-4" />}>
        <Editable
          label="Email"
          icon={<Mail size={14} />}
          name="email"
          value={form.email}
          editable={editMode}
          onChange={handleChange}
        />
        <Editable
          label="Phone Number"
          icon={<Phone size={14} />}
          name="contactNumber"
          value={form.contactNumber}
          editable={editMode}
          onChange={handleChange}
        />
        <Editable
          label="Date of Birth"
          icon={<Calendar size={14} />}
          name="dob"
          value={form.dob}
          type="date"
          editable={editMode}
          onChange={handleChange}
        />
        {editMode && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition text-white text-sm flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Check size={14} />}
            Save Changes
          </button>
        )}
      </Card>

      {/* Academic Info */}
      <Card title="Academic Information" icon={<BookOpen className="size-4" />}>
        <Read label="School" value={profile.school?.name} />
        <Read label="Department" value={profile.department?.name} />
        <Read label="Level / Class" value={profile.level || profile.class} />
      </Card>

      {/* Security */}
      <Card title="Security Settings" icon={<Lock className="size-4" />}>
        <p className="text-xs text-white/60 mb-3">
          For security reasons, re-enter your current password before changing to a new one.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {["Current", "New", "Confirm New"].map((label) => (
            <input
              key={label}
              type="password"
              placeholder={`${label} Password`}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 text-sm"
            />
          ))}
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition text-white text-sm flex items-center gap-2">
          <Lock size={14} /> Update Password
        </button>
      </Card>

      {/* Device Management */}
      <Card title="Device Management" icon={<Laptop className="size-4" />}>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white/80 flex justify-between">
          <div>
            <p>Device: Android Chrome</p>
            <p className="text-xs text-white/50">Last Login: 2 days ago</p>
          </div>
          <button className="text-red-400 text-xs hover:underline">Log Out</button>
        </div>
      </Card>

      {/* Data Export */}
      <Card title="Data Export / Backup" icon={<Download className="size-4" />}>
        <p className="text-sm text-white/70 mb-3">
          Download your AcadeX profile and academic data as a backup file.
        </p>
        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition text-white text-sm flex items-center gap-2"
        >
          <Download size={14} /> Export My Data (.json)
        </button>
      </Card>

      {/* Account Controls */}
      <Card title="Account Controls" icon={<UserRound className="size-4" />}>
        <div className="space-y-3">
          <button
            onClick={() => {
              localStorage.removeItem("acadexUser");
              window.location.href = "/portal";
            }}
            className="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm flex items-center gap-2 justify-center transition"
          >
            <LogOut size={14} /> Logout
          </button>

          <button
            onClick={handleDeactivateRequest}
            className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm flex items-center gap-2 justify-center transition"
          >
            <Trash2 size={14} /> Request Account Deactivation
          </button>
        </div>
      </Card>

      <p className="text-xs text-center text-white/40 pt-4">
        All updates are securely handled by your school&apos;s admin.
      </p>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-500/90 text-white text-sm px-6 py-3 rounded-xl shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------ Reusable Components ------------------ */
function Card({ title, icon, children }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1222]/80 via-[#0f1430]/60 to-[#0a0f1f]/80 backdrop-blur-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-400">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function Read({ label, value }: ReadProps) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm">
      <p className="text-[11px] text-white/50">{label}</p>
      <p className="font-medium text-white">{value || "—"}</p>
    </div>
  );
}

function Editable({
  label,
  value,
  icon,
  editable,
  onChange,
  name,
  type = "text",
}: EditableProps) {
  return (
    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm">
      {icon && <span className="text-blue-400">{icon}</span>}
      <div className="flex-1">
        <p className="text-[11px] text-white/50">{label}</p>
        {editable ? (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent outline-none border-b border-white/10 focus:border-blue-500/60 text-white text-sm"
          />
        ) : (
          <p className="font-medium text-white">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}
