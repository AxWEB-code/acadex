// src/lib/api.ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://acadex-backend-qrds.onrender.com";

export async function fetchJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}
