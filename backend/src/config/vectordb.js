import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GeminiEmbeddings } from "../services/geminiEmbeddingWrapper.js";

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
  throw new Error("Missing Pinecone environment variables");
}

// 🔹 Init Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// 🔹 Get index
const index = pinecone.Index(process.env.PINECONE_INDEX);

// 🔹 Embeddings
const embeddings = new GeminiEmbeddings();

// 🔥 FIXED: use constructor, NOT fromExistingIndex
export const getVectorStore = async (userId) => {
  const namespace = `user_${String(userId)}`;

  console.log("Using Pinecone index:", process.env.PINECONE_INDEX);
  console.log("Namespace:", namespace);

  return new PineconeStore(embeddings, {
    pineconeIndex: index,
    namespace
  });
};