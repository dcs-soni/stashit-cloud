import { ChromaClient, Collection } from "chromadb";
import { config } from "../config/index.js";
import type { ContentMetadata, SearchResult } from "../types/index.js";

const COLLECTION_NAME = "stashit_content";

let client: ChromaClient | null = null;
let collection: Collection | null = null;

const getClient = (): ChromaClient => {
  if (!client) {
    client = new ChromaClient({
      path: `https://api.trychroma.com`,
      tenant: config.chroma.tenant,
      database: config.chroma.database,
      auth: { provider: "token", credentials: config.chroma.apiKey },
    });
  }
  return client;
};

export const initializeChroma = async (): Promise<Collection> => {
  if (collection) return collection;

  const chromaClient = getClient();

  try {
    collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { "hnsw:space": "cosine" },
    });
    console.log(`✅ Chroma Cloud collection '${COLLECTION_NAME}' ready`);
    return collection;
  } catch (error) {
    console.error("❌ Failed to initialize Chroma Cloud:", error);
    throw error;
  }
};

export const createSearchableContent = (
  title: string,
  type: string,
  link: string,
): string => `${title} - ${type}: ${link}`;

export const createMetadata = (
  title: string,
  type: string,
  link: string,
  userId: string,
): ContentMetadata => ({
  title,
  type,
  link,
  userId,
  createdAt: new Date().toISOString(),
});

export const addToVectorDB = async (
  id: string,
  content: string,
  metadata: ContentMetadata,
): Promise<void> => {
  const col = await initializeChroma();
  await col.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });
};

export const removeFromVectorDB = async (id: string): Promise<boolean> => {
  try {
    const col = await initializeChroma();
    await col.delete({ ids: [id] });
    return true;
  } catch (error) {
    console.error("Vector DB deletion failed:", error);
    return false;
  }
};

export const searchVectorDB = async (
  query: string,
  userId: string,
  limit: number = 10,
): Promise<SearchResult[]> => {
  const col = await initializeChroma();

  const results = await col.query({
    queryTexts: [query],
    nResults: limit,
    where: { userId },
  });

  if (!results.documents?.[0]?.length) return [];

  return results.documents[0].map((doc, i) => ({
    id: results.ids[0][i],
    document: doc ?? "",
    score: results.distances ? 1 - (results.distances[0][i] ?? 0) : 0,
    metadata: {
      title:
        (results.metadatas?.[0]?.[i] as ContentMetadata)?.title ?? "Untitled",
      link: (results.metadatas?.[0]?.[i] as ContentMetadata)?.link ?? "",
      type: (results.metadatas?.[0]?.[i] as ContentMetadata)?.type ?? "unknown",
    },
  }));
};
