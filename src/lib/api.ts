export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
    "https://acadex-backend-qrds.onrender.com");

export async function fetchJSON(path: string, options?: RequestInit) {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${safePath}`;

  console.log("🌍 Fetching:", url); // 🧠 Helps us see the actual URL being called

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      console.error("❌ Fetch failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch: ${url}`);
    }

    return await res.json();
  } catch (err: unknown) {
    console.error("🚨 Network error:", err instanceof Error ? err.message : String(err));
    throw err;
  }
}