import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    console.log("📩 New Contact Message:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
