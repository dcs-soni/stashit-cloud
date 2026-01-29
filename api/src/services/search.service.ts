import { searchVectorDB } from "./chroma.service.js";
import type { SearchResponse } from "../types/index.js";

const SIMILARITY_THRESHOLD = 0.5;

export const searchContent = async (
  query: string,
  userId: string,
): Promise<SearchResponse> => {
  const results = await searchVectorDB(query, userId);

  if (results.length === 0) {
    return {
      answer:
        "I don't have any stashes that match your query yet. Try adding some content first!",
      results: [],
    };
  }

  const sortedResults = results.sort((a, b) => b.score - a.score);
  const bestMatch = sortedResults[0];

  if (bestMatch.score > SIMILARITY_THRESHOLD) {
    return {
      answer: `I found this most relevant stash: "${bestMatch.metadata.title}" (${Math.round(bestMatch.score * 100)}% match)`,
      results: [bestMatch],
    };
  }

  return {
    answer: "I couldn't find any highly relevant stashes matching your query.",
    results: [],
  };
};
