import { parsePDF } from "../utils/pdfparse.js";
import { cleanResumeText } from "../utils/textCleaner.js";
import { chunkResumeText } from "../utils/chunker.js";
import { getVectorStore } from "../config/vectordb.js";

export const processResume = async (file, userId) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file buffer");
    }

    console.log("🔹 Starting resume processing...");

    // 🔹 Step 1: Extract text
    const rawText = await parsePDF(file.buffer);

    if (!rawText || rawText.trim().length === 0) {
      throw new Error("PDF parsing returned empty text");
    }

    console.log("✅ PDF parsed");

    // 🔹 Step 2: Clean text
    const cleanText = cleanResumeText(rawText);

    // 🔹 Step 3: Chunk into documents
    const documents = await chunkResumeText(cleanText);

    if (!documents.length) {
      throw new Error("No valid chunks extracted from resume");
    }

    console.log(`✅ Chunked into ${documents.length} documents`);

    // 🔹 Step 4: Get vector store
    const store = await getVectorStore(userId);

    // 🔥 Step 5: Safe delete (avoid 404 crash)
    try {
      await store.delete({ deleteAll: true });
      console.log("🗑️ Previous vectors deleted");
    } catch (err) {
      console.warn("⚠️ No previous vectors to delete (safe)");
    }

    // 🔹 Step 6: Attach metadata (DO NOT add id manually)
    const docs = documents.map((doc, i) => ({
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        userId: String(userId),
        source: "resume",
        chunkIndex: i
      }
    }));

    console.log("📤 Uploading to Pinecone...");

    // 🔥 Step 7: Store embeddings
    await store.addDocuments(docs);

    console.log(`✅ Stored ${docs.length} chunks for user ${userId}`);

    // 🔹 Step 8: Preview
    const preview = docs.map((doc) => ({
      section: doc.metadata?.section || "general",
      content: doc.pageContent
    }));

    return {
      success: true,
      totalChunks: docs.length,
      preview
    };

  } catch (error) {
    console.error("❌ Error processing resume:", error);
    throw error;
  }
};