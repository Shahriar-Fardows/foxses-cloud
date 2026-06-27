const BASE_URL = process.env.UPSTREAM_SMS_BASE_URL as string;
const CLIENT_ID = process.env.UPSTREAM_SMS_CLIENT_ID as string;
const KEY = process.env.UPSTREAM_SMS_KEY as string;

export type UpstreamResult = {
  success: boolean;
  responseCode: number;
  message: string;
};

async function callUpstream(
  endpoint: "send-message" | "resend-message",
  recipient: string,
  message: string,
  senderId?: string
): Promise<UpstreamResult> {
  if (!BASE_URL || !CLIENT_ID || !KEY) {
    return { success: false, responseCode: 500, message: "Upstream SMS provider is not configured" };
  }

  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        key: KEY,
        recipient,
        message,
        ...(senderId ? { sender_id: senderId } : {}),
      }),
    });

    const data = await res.json().catch(() => null);
    if (!data) {
      return { success: false, responseCode: 502, message: "Invalid response from upstream provider" };
    }

    return {
      success: res.ok && data.response_code === 200,
      responseCode: data.response_code ?? res.status,
      message: data.message || "Unknown upstream response",
    };
  } catch {
    return { success: false, responseCode: 503, message: "Could not reach upstream SMS provider" };
  }
}

export function sendViaUpstream(recipient: string, message: string, senderId?: string) {
  return callUpstream("send-message", recipient, message, senderId);
}

export function resendViaUpstream(recipient: string, message: string, senderId?: string) {
  return callUpstream("resend-message", recipient, message, senderId);
}

export async function getUpstreamBalance(): Promise<{ balance: number; status: string } | null> {
  if (!BASE_URL || !CLIENT_ID) return null;
  try {
    const res = await fetch(`${BASE_URL}/get-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CLIENT_ID }),
    });
    const data = await res.json();
    if (data.response_code !== 200) return null;
    return { balance: data.balance, status: data.status };
  } catch {
    return null;
  }
}
