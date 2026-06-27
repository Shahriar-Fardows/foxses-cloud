import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SmsLog from "@/models/SmsLog";
import { requireClient } from "@/lib/guards";

export async function GET() {
  const { session, error } = await requireClient();
  if (error) return error;

  await connectDB();
  const logs = await SmsLog.find({ client: session!.id }).sort({ createdAt: -1 }).limit(200).lean();

  return NextResponse.json({ response_code: 200, logs });
}
