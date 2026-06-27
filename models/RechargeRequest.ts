import { Schema, models, model, Types } from "mongoose";

export type RechargeStatus = "pending" | "approved" | "rejected";

export interface IRechargeRequest {
  client: Types.ObjectId;
  amount: number;
  method: string;
  trxId?: string;
  status: RechargeStatus;
  note?: string;
  reviewedBy?: Types.ObjectId;
  createdAt: Date;
}

const RechargeRequestSchema = new Schema<IRechargeRequest>({
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  amount: { type: Number, required: true },
  method: { type: String, default: "Manual" },
  trxId: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  note: { type: String },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  createdAt: { type: Date, default: Date.now },
});

export default models.RechargeRequest ||
  model<IRechargeRequest>("RechargeRequest", RechargeRequestSchema);
