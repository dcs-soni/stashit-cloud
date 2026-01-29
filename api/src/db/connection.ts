import mongoose from "mongoose";
import { config } from "../config/index.js";

export const connectDatabase = async (): Promise<typeof mongoose> => {
  return mongoose.connect(config.database.url);
};

export { mongoose };
