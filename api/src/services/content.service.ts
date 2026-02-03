import { ContentModel } from "../db/models/content.model.js";
import { LinkModel } from "../db/models/link.model.js";
import { UserModel } from "../db/models/user.model.js";
import {
  addToVectorDB,
  removeFromVectorDB,
  createSearchableContent,
  createMetadata,
} from "./chroma.service.js";
import { generateRandomString } from "../utils/random.js";
import type { Content } from "../types/index.js";

export const createContent = async (
  title: string,
  link: string,
  type: string,
  userId: string,
): Promise<Content> => {
  const content = await ContentModel.create({
    title,
    link,
    type,
    userId,
    tags: [],
  });

  const searchable = createSearchableContent(title, type, link);
  const metadata = createMetadata(title, type, link, userId);
  await addToVectorDB(content._id.toString(), searchable, metadata);

  return content;
};

export const getUserContent = (userId: string) =>
  ContentModel.find({ userId }).populate("userId");

export const deleteContent = async (
  contentId: string,
  userId: string,
): Promise<boolean> => {
  const result = await ContentModel.deleteOne({ _id: contentId, userId });

  if (result.deletedCount > 0) {
    await removeFromVectorDB(contentId);
    return true;
  }
  return false;
};

export const createShareLink = async (userId: string): Promise<string> => {
  const existing = await LinkModel.findOne({ userId });
  if (existing) return existing.hash;

  const hash = generateRandomString(10);
  await LinkModel.create({ userId, hash });
  return hash;
};

export const deleteShareLink = (
  userId: string,
): Promise<{ deletedCount: number }> =>
  LinkModel.deleteOne({ userId }) as unknown as Promise<{
    deletedCount: number;
  }>;

export const getSharedContent = async (hash: string) => {
  const link = await LinkModel.findOne({ hash });
  if (!link) return null;

  const [content, user] = await Promise.all([
    ContentModel.find({ userId: link.userId }),
    UserModel.findById(link.userId),
  ]);

  if (!user) return null;
  return { username: user.username, content };
};
