import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { requireAdmin } from "@/lib/guards";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/clients/[id]/nid/[side]">
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id, side } = await ctx.params;
  if (side !== "front" && side !== "back") {
    return NextResponse.json({ response_code: 400, message: "Invalid side" }, { status: 400 });
  }

  await connectDB();
  const client = await Client.findById(id);
  if (!client) {
    return NextResponse.json({ response_code: 404, message: "Client not found" }, { status: 404 });
  }

  const key = side === "front" ? client.nidFrontKey : client.nidBackKey;
  if (!key) {
    return NextResponse.json({ response_code: 404, message: "Photo not found" }, { status: 404 });
  }

  const object = await getFromR2(key);
  const body = await object.Body?.transformToByteArray();
  if (!body) {
    return NextResponse.json({ response_code: 404, message: "Photo not found" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(body), {
    headers: { "Content-Type": object.ContentType || "image/jpeg" },
  });
}
