import { embedText, embedBatch } from "./embedding.service.js";

export class GeminiEmbeddings {

  
  async embedQuery(text) {
    return await embedText(text, "RETRIEVAL_QUERY");
  }

  
  async embedDocuments(texts) {
    return await embedBatch(texts);
  }
}