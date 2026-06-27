import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ response_code: 401, message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ response_code: 200, user: session });
}
