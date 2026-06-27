import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RechargeRequest from "@/models/RechargeRequest";
import Client from "@/models/Client";
import { requireAdmin } from "@/lib/guards";
import { notifyDiscord } from "@/lib/discord";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/recharge-requests/[id]">
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const { action } = await request.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ response_code: 400, message: "action must be approve or reject" }, { status: 400 });
  }

  await connectDB();

  const rechargeRequest = await RechargeRequest.findById(id);
  if (!rechargeRequest) {
    return NextResponse.json({ response_code: 404, message: "Recharge request not found" }, { status: 404 });
  }
  if (rechargeRequest.status !== "pending") {
    return NextResponse.json({ response_code: 409, message: "Request already reviewed" }, { status: 409 });
  }

  rechargeRequest.status = action === "approve" ? "approved" : "rejected";
  rechargeRequest.reviewedBy = session!.id as never;
  await rechargeRequest.save();

  if (action === "approve") {
    await Client.findByIdAndUpdate(rechargeRequest.client, {
      $inc: { balance: rechargeRequest.amount },
    });
  }

  await notifyDiscord(
    `${action === "approve" ? "✅" : "❌"} Recharge request for **${rechargeRequest.amount}** was **${rechargeRequest.status}** by ${session!.name}`
  );

  return NextResponse.json({ response_code: 200, message: `Request ${rechargeRequest.status}` });
}
