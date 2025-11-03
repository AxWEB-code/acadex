"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE } from "@/lib/config";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("⚠️ Invalid or missing reset token.");
      setExpired(true);
      return;
    }
    if (!password || password !== confirm) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("✅ Password reset successful! Redirecting to login...");
      } else if (data.error?.toLowerCase().includes("expired")) {
        setExpired(true);
        setMessage("⏰ Reset link has expired. Please request a new one.");
      } else if (data.error?.toLowerCase().includes("invalid")) {
        setExpired(true);
        setMessage("❌ Invalid reset token. Please request a new link.");
      } else {
        setMessage(`❌ ${data.error || "Reset failed. Please try again."}`);
      }
    } catch {
      setMessage("🚫 Server unreachable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Redirect automatically after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/portal/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-6">
      <div className="bg-[#181b2c]/90 p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">Reset Password</h1>

        {expired ? (
          <div className="text-center text-gray-300 space-y-4">
            <p>⏰ Your reset link has expired or is invalid.</p>
            <p>
              Please go back to{" "}
              <a
                href="/portal/login"
                className="text-blue-400 hover:underline"
              >
                Forgot Password
              </a>{" "}
              and request a new link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              success
                ? "text-green-400"
                : expired
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        Powered by <span className="text-blue-400">AxWEB Technologies</span>
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}