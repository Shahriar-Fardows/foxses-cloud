import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RechargeRequest from "@/models/RechargeRequest";
import { requireAdmin } from "@/lib/guards";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const filter = status ? { status } : {};

  const requests = await RechargeRequest.find(filter)
    .populate("client", "name email clientId")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ response_code: 200, requests });
}
