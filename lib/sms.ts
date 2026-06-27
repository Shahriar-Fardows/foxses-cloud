export const SMS_COST_PER_MESSAGE = 0.5;

const PHONE_REGEX = /^(01[3-9]\d{8}|8801[3-9]\d{8})$/;

export function isValidPhone(phone: string) {
  return PHONE_REGEX.test(phone.trim());
}

export function parseRecipients(recipient: string) {
  return recipient
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
}

export const GATEWAYS = ["gateway-1", "gateway-2", "gateway-3"];

export function pickFreshGateway(lastGateway?: string) {
  const candidates = GATEWAYS.filter((g) => g !== lastGateway);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? GATEWAYS[0];
}
