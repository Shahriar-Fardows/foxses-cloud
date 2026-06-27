import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { hashPassword, signToken, setAuthCookie, CLIENT_COOKIE } from "@/lib/auth";
import { generateClientId, generateApiKey } from "@/lib/ids";
import { notifyDiscord } from "@/lib/discord";
import { uploadToR2 } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function uploadNidPhoto(file: File, clientId: string, side: "front" | "back") {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`NID ${side} photo must be JPEG, PNG, or WEBP`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`NID ${side} photo must be under 5MB`);
  }
  const ext = file.type.split("/")[1];
  const key = `nid/${clientId}/${side}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadToR2(key, buffer, file.type);
  return key;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const phone = formData.get("phone") as string | null;
  const nidFront = formData.get("nidFront") as File | null;
  const nidBack = formData.get("nidBack") as File | null;

  if (!name || !email || !password) {
    return NextResponse.json(
      { response_code: 400, message: "name, email and password are required" },
      { status: 400 }
    );
  }

  if (!nidFront || !nidBack) {
    return NextResponse.json(
      { response_code: 400, message: "NID front and back photos are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await Client.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { response_code: 409, message: "Email already registered" },
      { status: 409 }
    );
  }

  const clientId = generateClientId();

  let nidFrontKey: string;
  let nidBackKey: string;
  try {
    [nidFrontKey, nidBackKey] = await Promise.all([
      uploadNidPhoto(nidFront, clientId, "front"),
      uploadNidPhoto(nidBack, clientId, "back"),
    ]);
  } catch (err) {
    return NextResponse.json(
      { response_code: 400, message: err instanceof Error ? err.message : "NID upload failed" },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(password);
  const client = await Client.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    phone: phone || undefined,
    clientId,
    apiKey: generateApiKey(),
    balance: 0,
    status: "Active",
    nidFrontKey,
    nidBackKey,
  });

  const token = signToken({
    kind: "client",
    id: client._id.toString(),
    email: client.email,
    name: client.name,
    clientId: client.clientId,
  });
  await setAuthCookie(CLIENT_COOKIE, token);

  await notifyDiscord(
    `👤 New client registered: **${client.name}** (${client.email}) — Client ID \`${client.clientId}\``
  );

  return NextResponse.json({
    response_code: 200,
    message: "Registered successfully",
    user: {
      id: client._id,
      name: client.name,
      email: client.email,
      clientId: client.clientId,
      apiKey: client.apiKey,
      balance: client.balance,
      status: client.status,
    },
  });
}
