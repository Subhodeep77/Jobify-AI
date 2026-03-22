import { parsePDF } from "../utils/pdfParser.js";
import { cleanResumeText } from "../utils/textCleaner.js";
import { chunkResumeText } from "../utils/chunker.js";
import { getVectorStore } from "../configs/vectordb.js";

export const processResume = async (file, userId) => {
  try {
    const rawText = await parsePDF(file.buffer);

    const cleanText = cleanResumeText(rawText);

    const documents = chunkResumeText(cleanText);

    if (!documents.length) {
      throw new Error("No valid chunks extracted from resume");
    }

    const store = await getVectorStore(userId);

    // 🔥 Optional: clear old resume
    await store.delete({ deleteAll: true });

    // 🔥 Add IDs + metadata
    const docsWithIds = documents.map((doc, i) => ({
      ...doc,
      id: `${userId}_${Date.now()}_${i}`,
      metadata: {
        ...doc.metadata,
        userId,
        source: "resume"
      }
    }));

    await store.addDocuments(docsWithIds);

    console.log(`Stored ${documents.length} chunks for user ${userId}`);

    return true;

  } catch (error) {
    console.error("Error processing resume:", error);
    throw error;
  }
};