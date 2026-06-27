import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import SmsLog from "@/models/SmsLog";
import { requireClient } from "@/lib/guards";
import { isValidPhone, parseRecipients, SMS_COST_PER_MESSAGE, GATEWAYS } from "@/lib/sms";
import { checkLowBalanceAlert } from "@/lib/balanceAlerts";
import { sendViaUpstream } from "@/lib/smsProvider";

export async function POST(request: NextRequest) {
  const { session, error } = await requireClient();
  if (error) return error;

  const { recipient, message, sender_id } = await request.json();

  if (!recipient || !message) {
    return NextResponse.json(
      { response_code: 400, message: "recipient and message are required" },
      { status: 400 }
    );
  }

  await connectDB();
  const client = await Client.findById(session!.id);
  if (!client) {
    return NextResponse.json({ response_code: 404, message: "Account not found" }, { status: 404 });
  }

  if (client.status !== "Active") {
    return NextResponse.json(
      { response_code: 2002, message: "Your account is inactive. Please contact admin." },
      { status: 403 }
    );
  }

  const recipients = parseRecipients(recipient);
  if (recipients.length === 0 || recipients.some((r) => !isValidPhone(r))) {
    return NextResponse.json(
      {
        response_code: 1001,
        message: "Invalid recipient number. Supported formats: 01XXXXXXXXX or 8801XXXXXXXXX.",
      },
      { status: 400 }
    );
  }

  const totalCost = recipients.length * SMS_COST_PER_MESSAGE;
  if (client.balance < totalCost) {
    return NextResponse.json({ response_code: 2003, message: "Insufficient balance." }, { status: 402 });
  }

  const senderId = sender_id || client.senderId;
  const upstream = await sendViaUpstream(recipient, message, senderId);
  if (!upstream.success) {
    return NextResponse.json(
      { response_code: upstream.responseCode, message: upstream.message },
      { status: 502 }
    );
  }

  const oldBalance = client.balance;
  client.balance -= totalCost;
  await client.save();

  await checkLowBalanceAlert(client, oldBalance, client.balance);

  const gatewayUsed = GATEWAYS[0];
  await SmsLog.insertMany(
    recipients.map((r) => ({
      client: client._id,
      recipient: r,
      message,
      senderId,
      endpoint: "send-message",
      status: "sent",
      cost: SMS_COST_PER_MESSAGE,
      gatewayUsed,
      messageType: client.messageType,
    }))
  );

  return NextResponse.json({
    response_code: 200,
    message: upstream.message,
    balance: client.balance,
  });
}
