import { embedText, embedBatch } from "../../services/embedding.service.js";

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (!denom) return 0;

  return dot / denom;
};

export const matchJobs = async (resumeContext, jobs) => {
  try {
    if (!jobs.length) return [];

    // 🔥 Use only top chunks (reduce noise)
    // instead of splitting, slicing, etc. what we can do is to store resume summary generated from LLM
    // store that within a text_file/ mongodb/ in memory, then provide that resume summary and the message
    // from user to generate roles from LLM, provide these roles within a query to serpapi and then according to that
    // resume summary and jobs returned from serpapi is matched through matcher.
    const resumeSummary = resumeContext
      .split("\n\n")
      .slice(0, 3)
      .join("\n\n");

    const resumeEmbedding = await embedText(
      resumeSummary,
      "RETRIEVAL_QUERY"
    );

    const jobTexts = jobs.map(job => `
      Title: ${job.title || ""}
      Description: ${job.description || ""}
    `);

    const jobEmbeddings = await embedBatch(jobTexts);

    const results = jobs.map((job, index) => {
      const jobEmbedding = jobEmbeddings[index];

      if (!jobEmbedding || jobEmbedding.length !== resumeEmbedding.length) {
        return {
          ...job,
          match_score: 0.3
        };
      }

      const similarity = cosineSimilarity(resumeEmbedding, jobEmbedding);

      // 🔥 normalize to 0–1
      const normalized = (similarity + 1) / 2;

      return {
        ...job,
        match_score: Number(normalized.toFixed(3))
      };
    });

    return results.sort((a, b) => b.match_score - a.match_score);

  } catch (error) {
    console.error("Matcher error:", error?.response?.data || error.message || error);

    return jobs.map(job => ({
      ...job,
      match_score: 0.5
    }));
  }
};