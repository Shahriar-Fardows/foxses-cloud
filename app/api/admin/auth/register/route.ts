import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { hashPassword, signToken, setAuthCookie, getAdminSession, ADMIN_COOKIE } from "@/lib/auth";
import { notifyDiscord } from "@/lib/discord";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { response_code: 400, message: "name, email and password are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { response_code: 409, message: "Email already registered" },
      { status: 409 }
    );
  }

  const adminCount = await AdminUser.countDocuments();
  let role: "super_admin" | "admin" | "staff" = "staff";

  if (adminCount === 0) {
    // First ever admin registrant becomes the super admin.
    role = "super_admin";
  } else {
    // Only an authenticated super_admin/admin can create further staff/admin accounts.
    const session = await getAdminSession();
    if (!session || (session.role !== "super_admin" && session.role !== "admin")) {
      return NextResponse.json(
        { response_code: 403, message: "Only an admin can register new staff accounts" },
        { status: 403 }
      );
    }
    if (body.role === "admin" && session.role !== "super_admin") {
      return NextResponse.json(
        { response_code: 403, message: "Only the super admin can create admin accounts" },
        { status: 403 }
      );
    }
    role = body.role === "admin" ? "admin" : "staff";
  }

  const hashed = await hashPassword(password);
  const admin = await AdminUser.create({ name, email: email.toLowerCase(), password: hashed, role });

  const token = signToken({
    kind: "admin",
    id: admin._id.toString(),
    role: admin.role,
    email: admin.email,
    name: admin.name,
  });
  await setAuthCookie(ADMIN_COOKIE, token);

  await notifyDiscord(
    `🛡️ New ${admin.role.replace("_", " ")} account registered: **${admin.name}** (${admin.email})`
  );

  return NextResponse.json({
    response_code: 200,
    message: "Registered successfully",
    user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}
