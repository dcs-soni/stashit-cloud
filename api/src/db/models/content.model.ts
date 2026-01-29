import mongoose, { Schema, model } from "mongoose";
import type { Content } from "../../types/index.js";

const contentSchema = new Schema<Content>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient user content queries
contentSchema.index({ userId: 1, createdAt: -1 });

export const ContentModel = model<Content>("Content", contentSchema);
