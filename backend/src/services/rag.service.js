import { getVectorStore } from "../configs/vectordb.js";

export const retrieveContext = async (userId, query) => {
  try {
    const store = await getVectorStore(userId);

    // 🔥 Dynamic Top-K
    const K = query.length > 50 ? 6 : 4;

    const results = await store.similaritySearchWithScore(query, K);

    if (!results.length) {
      return {
        context: "",
        sources: []
      };
    }

    // 🔹 Format results
    let formatted = results.map(([doc, score]) => ({
      content: doc.pageContent,
      score,
      section: doc.metadata?.section || "unknown"
    }));

    // 🔥 Filter low-quality matches
    formatted = formatted.filter(item => item.score >= 0.7);

    // ⚠️ Fallback if everything filtered out
    if (!formatted.length) {
      formatted = results.map(([doc, score]) => ({
        content: doc.pageContent,
        score,
        section: doc.metadata?.section || "unknown"
      }));
    }

    // 🔹 Build context string
    const context = formatted
      .map((item, i) => 
        `[${i + 1}] (${item.section}, score: ${item.score.toFixed(2)}) ${item.content}`
      )
      .join("\n\n");

    return {
      context,
      sources: formatted
    };

  } catch (error) {
    console.error("RAG retrieval error:", error);
    throw error;
  }
};