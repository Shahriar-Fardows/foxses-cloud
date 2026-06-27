import { nanoid } from "nanoid";

export function generateClientId() {
  return `client_${nanoid(5)}`;
}

export function generateApiKey() {
  return nanoid(20);
}
