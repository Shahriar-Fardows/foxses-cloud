import { Schema, models, model, Types } from "mongoose";

export type SmsStatus = "sent" | "queued" | "failed";
export type SmsEndpoint = "send-message" | "resend-message";
export type SmsMessageType = "Masking" | "Non-Masking";

export interface ISmsLog {
  client: Types.ObjectId;
  recipient: string;
  message: string;
  senderId?: string;
  endpoint: SmsEndpoint;
  status: SmsStatus;
  segments: number;
  cost: number;
  buyCost: number;
  gatewayUsed: string;
  messageType: SmsMessageType;
  createdAt: Date;
}

const SmsLogSchema = new Schema<ISmsLog>({
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  senderId: { type: String },
  endpoint: { type: String, enum: ["send-message", "resend-message"], default: "send-message" },
  status: { type: String, enum: ["sent", "queued", "failed"], default: "sent" },
  segments: { type: Number, default: 1 },
  cost: { type: Number, default: 0 },
  buyCost: { type: Number, default: 0 },
  gatewayUsed: { type: String, default: "gateway-1" },
  messageType: { type: String, enum: ["Masking", "Non-Masking"], default: "Non-Masking" },
  createdAt: { type: Date, default: Date.now },
});

export default models.SmsLog || model<ISmsLog>("SmsLog", SmsLogSchema);
