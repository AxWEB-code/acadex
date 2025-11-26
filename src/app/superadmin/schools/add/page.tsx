"use client";
import { Request } from "express";
import { useState, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { motion } from "framer-motion";
import {
  Building2,
  BarChart3,
  Users,
  LogOut,
  Settings,
  Bell,
  Key,
  FileText,
  Home,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchJSON } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";

// Custom Modal Component
function CropModal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-[#0f0f17] border border-white/10 rounded-2xl p-4 w-[90%] max-w-md shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

export default function SuperAdminAddSchool() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    schoolType: "CBT",
    adminEmail: "",
    adminPassword: "",
    logo: "",
    plan: "free",
  });

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // IMPROVED Crop helper function
  const getCroppedImage = async (imageSrc: string, crop: any): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      const img = document.createElement("img");
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) return reject("Failed to crop image");
          resolve(blob);
        }, "image/png");
      };

      img.onerror = () => reject("Error loading image");
    });
  };

  const handleCropAndSave = async () => {
    if (!logoPreview || !croppedAreaPixels) return;

    try {
      // Get cropped image as blob
      const croppedBlob = await getCroppedImage(logoPreview, croppedAreaPixels);

      // Compress and resize to 300x300
      const compressedFile = await imageCompression(croppedBlob as File, {
        maxWidthOrHeight: 300,
        fileType: 'image/png',
        maxSizeMB: 1,
        useWebWorker: true,
      });

      // Create final file
      const finalFile = new File([compressedFile], 'logo.png', { 
        type: 'image/png',
        lastModified: Date.now()
      });

      // Update states
      setLogoFile(finalFile);
      setLogoPreview(URL.createObjectURL(compressedFile));
      setCropModalOpen(false);
      
    } catch (error) {
      console.error('Error cropping image:', error);
      setMessage({
        type: 'error',
        text: 'Failed to process image. Please try again.',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Please select an image file (JPEG, PNG, etc.)',
      });
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'Image must be smaller than 2MB',
      });
      return;
    }

    setOriginalImageFile(file);
    
    // Create preview and open crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const name = form.name.trim();
    const subdomain = form.subdomain.trim().toLowerCase();
    const adminEmail = form.adminEmail.trim().toLowerCase();
    const adminPassword = form.adminPassword;

    if (!name || !subdomain || !adminEmail || !adminPassword) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      setMessage({
        type: "error",
        text: "Subdomain can only contain lowercase letters, numbers, and hyphens.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subdomain", subdomain);
      formData.append("schoolType", form.schoolType);
      formData.append("adminEmail", adminEmail);
      formData.append("adminPassword", adminPassword);
      formData.append("plan", form.plan);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const data = await fetchJSON("/api/superadmin/schools", {
        method: "POST",
        body: formData,
        isFormData: true,
      });

      if (data?.success) {
        setMessage({
          type: "success",
          text: "School created successfully. Redirecting...",
        });

        setTimeout(() => {
          router.push("/superadmin/schools");
        }, 800);
      } else {
        setMessage({
          type: "error",
        text: data?.message || "Failed to create school.",
        });
      }
    } catch (err: any) {
      console.error("Create school error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Network error creating school.",
      });
    } finally {
      setSubmitting(false);
    }
  }

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
          className={`fixed top-0 left-0 h-full w-64 backdrop-blur-xl border-r border-white/10 bg-white/[0.03] flex flex-col justify-between transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div>
            {/* Sidebar Header */}
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
                  <h2 className="text-sm font-semibold leading-tight">AcadeX Console</h2>
                  <p className="text-[11px] text-blue-400/70">SuperAdmin Access</p>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="md:hidden text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
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
              <NavItem href="/superadmin/logs" icon={FileText}>
                Logs & Activities
              </NavItem>
              <NavItem href="/superadmin/keys" icon={Key}>
                Access Keys
              </NavItem>
              <NavItem href="/superadmin/billing" icon={BarChart3}>
                Billing & Plans
              </NavItem>
              <NavItem href="/superadmin/settings" icon={Settings}>
                Platform Settings
              </NavItem>
              <NavItem href="/superadmin/notifications" icon={Bell}>
                Notifications
              </NavItem>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs mb-3">
              <p className="text-white/60">Logged in as</p>
              <p className="font-semibold text-blue-300 mt-1">SuperAdmin</p>
            </div>
            <NavItem href="/portal" icon={LogOut}>
              Logout
            </NavItem>
            <p className="text-xs text-white/30 text-center mt-3">© 2025 AcadeX Console</p>
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
            <h1 className="text-sm font-semibold">SuperAdmin</h1>
            <Image
              src="/acadex-logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-full border border-white/20"
            />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1420] via-[#0b0e18] to-[#0a0c14] p-6 shadow-2xl"
          >
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Building2 className="text-blue-400" /> Add New School
              </h1>
              <p className="text-sm text-white/60">
                Register a new institution and assign a primary admin immediately.
              </p>
            </div>

            <Link
              href="/superadmin/schools"
              className="mt-4 sm:mt-0 px-4 py-2 border border-white/15 rounded-lg text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
            >
              Back to Schools
            </Link>
          </motion.div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form Card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl grid gap-6 md:grid-cols-2"
          >
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  School Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  Subdomain <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm">
                  <span className="text-white/40 text-xs mr-1">https://</span>
                  <input
                    type="text"
                    value={form.subdomain}
                    onChange={(e) => updateField("subdomain", e.target.value.toLowerCase())}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="ecn-college"
                  />
                  <span className="text-white/40 text-xs ml-1">.acadex.app</span>
                </div>
                <p className="text-[11px] text-white/40 mt-1">
                  Only lowercase letters, numbers, and hyphens are allowed.
                </p>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  School Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.schoolType}
                  onChange={(e) => updateField("schoolType", e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="TERTIARY">Tertiary</option>
                  <option value="CBT">CBT / Training Center</option>
                </select>
              </div>

              {/* UPDATED LOGO UPLOAD WITH CROPPER */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  School Logo
                </label>

                {/* Preview */}
                {logoPreview ? (
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/30 border border-white/15 mb-3">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-xl flex items-center justify-center bg-black/30 border border-white/15 text-white/50 mb-3 text-xs text-center">
                    No Logo Selected
                  </div>
                )}

                {/* Upload button */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                <p className="text-[11px] text-white/40 mt-1">
                  PNG, JPG, or WebP. Will be auto-cropped to square and resized to 300×300.
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  Admin Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => updateField("adminEmail", e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="admin@school.edu"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">
                  Admin Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={form.adminPassword}
                  onChange={(e) => updateField("adminPassword", e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Share this with the primary school admin. They can change it later.
                </p>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => updateField("plan", e.target.value)}
                  className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-600 px-4 py-2.5 text-sm font-medium shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating School..." : "Create School"}
                </button>
                <p className="text-[11px] text-white/35 mt-2">
                  A unique school code and primary admin account will be generated automatically.
                </p>
              </div>
            </div>
          </motion.form>

          {/* Crop Modal */}
          <CropModal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
            <div className="text-lg font-semibold mb-4">Crop School Logo</div>
            
            <div className="relative w-full h-64 bg-black/20 rounded-xl overflow-hidden">
              <Cropper
                image={logoPreview || undefined}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom controls */}
            <div className="mt-4">
              <label className="text-sm text-white/60 mb-2 block">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropAndSave}
                className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Crop & Save
              </button>
            </div>
          </CropModal>

          <footer className="mt-8 text-center text-xs text-white/40">
            Powered by <span className="text-blue-400 font-semibold">AxWEB Technologies</span> ⚡
          </footer>
        </main>
      </div>
    </FadeIn>
  );
}

/* ---------- Reusable Nav ---------- */
function NavItem({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
        isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <Icon className="size-4 opacity-90" />
      <span>{children}</span>
    </Link>
  );
}