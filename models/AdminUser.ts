import { Schema, models, model } from "mongoose";

export type AdminRole = "super_admin" | "admin" | "staff";

export interface IAdminUser {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "admin", "staff"], default: "staff" },
  createdAt: { type: Date, default: Date.now },
});

export default models.AdminUser || model<IAdminUser>("AdminUser", AdminUserSchema);
