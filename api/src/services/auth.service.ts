import { UserModel } from "../db/models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import type { User } from "../types/index.js";

export const findUserByUsername = (username: string) =>
  UserModel.findOne({ username });

export const createUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  return UserModel.create({ username, password: hashedPassword });
};

export const validateCredentials = async (
  username: string,
  password: string,
): Promise<User | null> => {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
};
