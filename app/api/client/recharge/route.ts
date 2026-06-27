import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RechargeRequest from "@/models/RechargeRequest";
import { requireClient } from "@/lib/guards";
import { notifyDiscord } from "@/lib/discord";
import { MIN_RECHARGE_AMOUNT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const { session, error } = await requireClient();
  if (error) return error;

  const { amount, method, trxId, note } = await request.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ response_code: 400, message: "A valid amount is required" }, { status: 400 });
  }

  if (amount < MIN_RECHARGE_AMOUNT) {
    return NextResponse.json(
      { response_code: 400, message: `Minimum recharge amount is ${MIN_RECHARGE_AMOUNT} BDT` },
      { status: 400 }
    );
  }

  await connectDB();
  const rechargeRequest = await RechargeRequest.create({
    client: session!.id,
    amount,
    method: method || "Manual",
    trxId,
    note,
    status: "pending",
  });

  await notifyDiscord(
    `💰 New recharge request: **${session!.name}** (${session!.clientId}) requested **${amount}** via ${method || "Manual"}`
  );

  return NextResponse.json({
    response_code: 200,
    message: "Recharge request submitted. Awaiting admin approval.",
    request: rechargeRequest,
  });
}

export async function GET() {
  const { session, error } = await requireClient();
  if (error) return error;

  await connectDB();
  const requests = await RechargeRequest.find({ client: session!.id }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ response_code: 200, requests });
}
