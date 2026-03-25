import { getVectorStore } from "../config/vectordb.js";

export const retrieveContext = async (userId, query) => {
  try {
    const store = await getVectorStore(userId);

    const K = query.length > 50 ? 6 : 4;

    const results = await store.similaritySearchWithScore(query, K);

    console.log('results: ', results)

    if (!results.length) {
      return {
        context: "",
        cleanContext: "",
        sources: []
      };
    }

    // 🔹 Format results
    let formatted = results.map(([doc, score]) => ({
      content: doc.pageContent,
      score,
      section: doc.metadata?.section || "unknown"
    }));

    console.log('formatted: ', formatted);
    

    // 🔥 Filter low-quality matches
    formatted = formatted.filter(item => item.score >= 0.7);
    console.log('formatted: ', formatted);

    // ⚠️ fallback if empty
    if (!formatted.length) {
      formatted = results.map(([doc, score]) => ({
        content: doc.pageContent,
        score,
        section: doc.metadata?.section || "unknown"
      }));
    }

    // ✅ Clean context (for embeddings / matcher)
    const cleanContext = formatted
      .map(item => item.content)
      .join("\n\n");

    console.log('clean_context: ', cleanContext);
    

    // ✅ Rich context (for LLM)
    const context = formatted
      .map((item, i) =>
        `[${i + 1}] (${item.section}, score: ${item.score.toFixed(2)}) ${item.content}`
      )
      .join("\n\n");
    console.log('context: ', context);
    
    return {
      context,
      cleanContext,
      sources: formatted
    };

  } catch (error) {
    console.error("RAG retrieval error:", error);
    throw error;
  }
};