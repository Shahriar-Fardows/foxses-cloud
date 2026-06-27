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

const ENGLISH_CHARS_PER_SEGMENT = 160;
const BANGLA_CHARS_PER_SEGMENT = 65;

// Plain ASCII (GSM-7 compatible) messages count as English; anything outside
// that range (e.g. Bangla/Unicode) uses the shorter Bangla segment size.
function isEnglishMessage(message: string) {
  return /^[\x00-\x7F]*$/.test(message);
}

export function countSegments(message: string) {
  const length = message.length || 1;
  const perSegment = isEnglishMessage(message) ? ENGLISH_CHARS_PER_SEGMENT : BANGLA_CHARS_PER_SEGMENT;
  return Math.max(1, Math.ceil(length / perSegment));
}
