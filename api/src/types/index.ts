import { Types } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  username: string;
  password: string;
}

export interface Content {
  _id: Types.ObjectId;
  title: string;
  link: string;
  type: string;
  tags: Types.ObjectId[];
  userId: Types.ObjectId;
  createdAt: Date;
}

export interface Link {
  _id: Types.ObjectId;
  hash: string;
  userId: Types.ObjectId;
}

export interface ContentMetadata {
  [key: string]: string; // Index signature for ChromaDB compatibility
  title: string;
  type: string;
  link: string;
  userId: string;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  document: string;
  score: number;
  metadata: {
    title: string;
    link: string;
    type: string;
  };
}

export interface SearchResponse {
  answer: string;
  results: SearchResult[];
}
