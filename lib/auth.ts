import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export type AdminTokenPayload = {
  kind: "admin";
  id: string;
  role: "super_admin" | "admin" | "staff";
  email: string;
  name: string;
};

export type ClientTokenPayload = {
  kind: "client";
  id: string;
  email: string;
  name: string;
  clientId: string;
};

export type TokenPayload = AdminTokenPayload | ClientTokenPayload;

export const ADMIN_COOKIE = "admin_token";
export const CLIENT_COOKIE = "client_token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken<T extends TokenPayload = TokenPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

export async function setAuthCookie(name: string, token: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken<AdminTokenPayload>(token);
  if (!payload || payload.kind !== "admin") return null;
  return payload;
}

export async function getClientSession(): Promise<ClientTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken<ClientTokenPayload>(token);
  if (!payload || payload.kind !== "client") return null;
  return payload;
}
