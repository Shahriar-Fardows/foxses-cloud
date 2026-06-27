import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SmsLog from "@/models/SmsLog";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const logs = await SmsLog.find()
    .populate("client", "name email clientId")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ response_code: 200, logs });
}
