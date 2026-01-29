import mongoose, { Schema, model } from "mongoose";
import type { User } from "../../types/index.js";

const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>("User", userSchema);
