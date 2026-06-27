import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { requireAdmin } from "@/lib/guards";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/clients/[id]">) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await request.json();

  const setFields: Record<string, unknown> = {};
  if (body.status && ["Active", "Inactive", "Suspended"].includes(body.status)) {
    setFields.status = body.status;
  }
  if (typeof body.senderId === "string") {
    setFields.senderId = body.senderId;
  }
  if (body.messageType && ["Masking", "Non-Masking"].includes(body.messageType)) {
    setFields.messageType = body.messageType;
  }

  const ops: Record<string, unknown> = {};
  if (Object.keys(setFields).length) ops.$set = setFields;
  if (typeof body.balanceAdjustment === "number") {
    ops.$inc = { balance: body.balanceAdjustment };
  }

  await connectDB();
  const client = await Client.findByIdAndUpdate(id, ops, { new: true }).select("-password");

  if (!client) {
    return NextResponse.json({ response_code: 404, message: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ response_code: 200, client });
}
