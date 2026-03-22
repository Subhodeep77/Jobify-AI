import { embedText, embedBatch } from "./embedding.service.js";

export class GeminiEmbeddings {

  // 🔥 Used when user asks query
  async embedQuery(text) {
    return await embedText(text, "RETRIEVAL_QUERY");
  }

  // 🔥 Used when storing resume chunks
  async embedDocuments(texts) {
    return await embedBatch(texts);
  }
}