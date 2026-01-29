import mongoose, { Schema, model } from "mongoose";
import type { Link } from "../../types/index.js";

const linkSchema = new Schema<Link>({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const LinkModel = model<Link>("Link", linkSchema);
