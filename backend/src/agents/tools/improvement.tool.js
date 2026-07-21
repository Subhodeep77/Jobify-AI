import { geminiCall } from "../../config/gemini.js";

const basicExtraction = (resumeContext, jobs) => {
  const missing = [];

  jobs.forEach(job => {
    const words = (job.description || "").split(" ");

    words.forEach(word => {
      if (
        word.length > 4 &&
        !resumeContext.toLowerCase().includes(word.toLowerCase())
      ) {
        missing.push(word.toLowerCase());
      }
    });
  });

  return [...new Set(missing)].slice(0, 10);
};

export const suggestImprovements = async (resumeContext, jobs) => {
  try {
    if (!jobs.length) return [];

    const jobText = jobs
      .slice(0, 3)
      .map(job => `
        Title: ${job.title}
        Description: ${job.description}
      `)
      .join("\n");

    const prompt = `
You are an AI career assistant.

STRICT RULES:
- Use ONLY given data
- Do NOT hallucinate
- Return ONLY JSON
- Extract ONLY skills (technical, tools, frameworks)

Resume:
${resumeContext}

Jobs:
${jobText}

TASK:
- Compare resume with jobs
- Identify missing skills
- Return only important skills

Return JSON:
{
  "missing_skills": []
}
`;

    const raw = await geminiCall(prompt);

    const cleaned = raw
      .replace(/```json|```/g, "")
      .replace(/^[^\{]*\{/s, "{")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn("LLM parsing failed → using fallback");
      return basicExtraction(resumeContext, jobs);
    }

    if (!parsed.missing_skills || !Array.isArray(parsed.missing_skills)) {
      return basicExtraction(resumeContext, jobs);
    }

    console.log('missing_skills from LLM: ', parsed.missing_skills.slice(0, 10));
    
    return parsed.missing_skills.slice(0, 10);

  } catch (error) {
    console.error("Improvement tool error:", error);

    return basicExtraction(resumeContext, jobs);
  }
};