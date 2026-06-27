import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const staff = await AdminUser.find().select("-password").sort({ createdAt: -1 }).lean();

  return NextResponse.json({ response_code: 200, staff });
}
