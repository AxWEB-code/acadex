"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE } from "@/lib/config";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("⚠️ Invalid or missing reset token.");
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
        setMessage("✅ Password reset successfully! You can now log in.");
      } else {
        setMessage(`❌ ${data.error || "Reset failed."}`);
      }
    } catch {
      setMessage("🚫 Server unreachable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white p-6">
      <div className="bg-[#181b2c]/90 p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        Powered by <span className="text-blue-400">AxWEB Technologies</span>
      </footer>
    </div>
  );
}
