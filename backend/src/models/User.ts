import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "customer";

export interface UserAttrs {
  email: string;
  passwordHash: string;
  name?: string;
  roles: UserRole[];
  isActive?: boolean;
}

export interface UserDoc extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    roles: { type: [String], enum: ["admin", "customer"], required: true, default: ["customer"] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserDoc>("User", userSchema);

