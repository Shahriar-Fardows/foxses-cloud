import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { requireClient } from "@/lib/guards";
import { generateApiKey } from "@/lib/ids";

export async function POST() {
  const { session, error } = await requireClient();
  if (error) return error;

  await connectDB();
  const apiKey = generateApiKey();
  const client = await Client.findByIdAndUpdate(session!.id, { $set: { apiKey } }, { new: true }).select(
    "-password"
  );

  return NextResponse.json({ response_code: 200, client });
}
