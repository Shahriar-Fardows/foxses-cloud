import { NextResponse } from "next/server";
import { clearAuthCookie, CLIENT_COOKIE } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie(CLIENT_COOKIE);
  return NextResponse.json({ response_code: 200, message: "Logged out" });
}
