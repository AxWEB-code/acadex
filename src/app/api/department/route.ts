// /src/app/api/departments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");

  if (!schoolId)
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });

  const departments = await prisma.department.findMany({
    where: { schoolId: Number(schoolId) },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(departments);
}
