import { NextResponse } from "next/server";
import { getAdminSession, getClientSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ response_code: 401, message: "Not authenticated" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireSuperAdmin() {
  const { session, error } = await requireAdmin();
  if (error) return { session: null, error };
  if (session!.role !== "super_admin") {
    return {
      session: null,
      error: NextResponse.json({ response_code: 403, message: "Super admin only" }, { status: 403 }),
    };
  }
  return { session, error: null };
}

export async function requireClient() {
  const session = await getClientSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ response_code: 401, message: "Not authenticated" }, { status: 401 }),
    };
  }
  return { session, error: null };
}
