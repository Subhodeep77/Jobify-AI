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

    const resumeSummary = resumeContext

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