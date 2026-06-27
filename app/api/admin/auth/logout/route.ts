import { NextResponse } from "next/server";
import { clearAuthCookie, ADMIN_COOKIE } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie(ADMIN_COOKIE);
  return NextResponse.json({ response_code: 200, message: "Logged out" });
}
