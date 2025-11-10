import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const key = url.searchParams.get("key");

  console.log("✅ Middleware triggered for:", url.pathname);
  console.log("🔑 Received key:", key);

  if (url.pathname === "/sys-verify" && key === "AxWEB_SUPER_2025") {
    console.log("🎯 Access key valid — redirecting to /superadmin/dashboard");
    return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
  }

  console.log("❌ Key invalid or missing — allowing normal access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/sys-verify"], // 👈 only match the base path itself
};
