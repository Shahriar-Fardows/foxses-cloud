import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import SmsLog from "@/models/SmsLog";
import { isValidPhone, countSegments, pickFreshGateway } from "@/lib/sms";
import { checkLowBalanceAlert } from "@/lib/balanceAlerts";
import { resendViaUpstream } from "@/lib/smsProvider";
import { getPricing, getPriceForType } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ response_code: 400, message: "Invalid JSON body" }, { status: 400 });
  }

  const { client_id, key, sender_id, recipient, message } = body;

  if (!client_id) {
    return NextResponse.json({ response_code: 2001, message: "Client ID not found." }, { status: 400 });
  }
  if (!key) {
    return NextResponse.json({ response_code: 3002, message: "Invalid API key." }, { status: 401 });
  }
  if (!recipient || !message) {
    return NextResponse.json(
      { response_code: 400, message: "recipient and message are required" },
      { status: 400 }
    );
  }
  if (recipient.includes(",")) {
    return NextResponse.json(
      { response_code: 1001, message: "Only a single recipient is supported for resend." },
      { status: 400 }
    );
  }
  if (!isValidPhone(recipient)) {
    return NextResponse.json(
      {
        response_code: 1001,
        message: "Invalid recipient number. Supported formats: 01XXXXXXXXX or 8801XXXXXXXXX.",
      },
      { status: 400 }
    );
  }

  await connectDB();

  const client = await Client.findOne({ clientId: client_id });
  if (!client) {
    return NextResponse.json({ response_code: 2001, message: "Client ID not found." }, { status: 404 });
  }

  if (client.apiKey !== key) {
    return NextResponse.json({ response_code: 3002, message: "Invalid API key." }, { status: 401 });
  }

  if (client.status !== "Active") {
    return NextResponse.json(
      { response_code: 2002, message: "Your account is inactive. Please contact admin." },
      { status: 403 }
    );
  }

  const pricing = await getPricing();
  const { buyPrice, sellPrice } = getPriceForType(pricing, client.messageType);
  const segments = countSegments(message);
  const cost = segments * sellPrice;
  const buyCost = segments * buyPrice;

  if (client.balance < cost) {
    return NextResponse.json(
      { response_code: 2003, message: "Insufficient balance." },
      { status: 402 }
    );
  }

  const upstream = await resendViaUpstream(recipient, message, sender_id);
  if (!upstream.success) {
    return NextResponse.json(
      { response_code: upstream.responseCode, message: upstream.message },
      { status: 502 }
    );
  }

  const lastLog = await SmsLog.findOne({ client: client._id, recipient }).sort({ createdAt: -1 });
  const gatewayUsed = pickFreshGateway(lastLog?.gatewayUsed);

  const oldBalance = client.balance;
  client.balance -= cost;
  await client.save();

  await checkLowBalanceAlert(client, oldBalance, client.balance);

  await SmsLog.create({
    client: client._id,
    recipient,
    message,
    senderId: sender_id,
    endpoint: "resend-message",
    status: "sent",
    segments,
    cost,
    buyCost,
    gatewayUsed,
    messageType: client.messageType,
  });

  return NextResponse.json({ response_code: 200, message: upstream.message });
}
