import { Schema, models, model } from "mongoose";

export type ClientStatus = "Active" | "Inactive" | "Suspended";
export type MessageType = "Masking" | "Non-Masking";

export interface IClient {
  name: string;
  email: string;
  password: string;
  phone?: string;
  clientId: string;
  apiKey: string;
  balance: number;
  status: ClientStatus;
  senderId?: string;
  messageType: MessageType;
  nidFrontKey?: string;
  nidBackKey?: string;
  resetTokenHash?: string;
  resetTokenExpires?: Date;
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String },
  clientId: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  senderId: { type: String },
  messageType: { type: String, enum: ["Masking", "Non-Masking"], default: "Non-Masking" },
  nidFrontKey: { type: String },
  nidBackKey: { type: String },
  resetTokenHash: { type: String },
  resetTokenExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default models.Client || model<IClient>("Client", ClientSchema);
