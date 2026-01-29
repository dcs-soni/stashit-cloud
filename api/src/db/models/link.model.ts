import mongoose, { Schema, model } from "mongoose";
import type { Link } from "../../types/index.js";

const linkSchema = new Schema<Link>({
  hash: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

// Index for fast share link lookups
linkSchema.index({ hash: 1 });

export const LinkModel = model<Link>("Link", linkSchema);
