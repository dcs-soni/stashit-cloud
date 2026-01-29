import mongoose, { Schema, model } from "mongoose";
import type { Content } from "../../types/index.js";

const contentSchema = new Schema<Content>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ContentModel = model<Content>("Content", contentSchema);
