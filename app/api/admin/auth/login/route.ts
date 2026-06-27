import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { verifyPassword, signToken, setAuthCookie, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { response_code: 400, message: "email and password are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const admin = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!admin || !(await verifyPassword(password, admin.password))) {
    return NextResponse.json(
      { response_code: 401, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signToken({
    kind: "admin",
    id: admin._id.toString(),
    role: admin.role,
    email: admin.email,
    name: admin.name,
  });
  await setAuthCookie(ADMIN_COOKIE, token);

  return NextResponse.json({
    response_code: 200,
    message: "Login successful",
    user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}
