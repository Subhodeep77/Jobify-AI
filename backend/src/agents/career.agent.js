import { geminiCall } from "../config/gemini.js";
import { getResumeContext } from "./tools/resume.tool.js";
import { getJobs } from "./tools/job.tool.js";
import { matchJobs } from "./tools/matcher.tool.js";
import { suggestImprovements } from "./tools/improvement.tool.js";
import { ResponseSchema } from "../schemas/agent.schema.js";

export const runAgent = async (userId, query, sendEvent, memory = {}) => {

  const historyText = (memory.history || [])
    .slice(-6)
    .filter(m => m.role === "user")
    .map(m => `${m.content}`)
    .join("\n");
  const preferencesText = JSON.stringify(memory.preferences || {});


  // 🔹 STEP 1: Resume Context
  sendEvent?.("agent_step", { tool: "resume", status: "start" });
  const { context, cleanContext } = await getResumeContext(userId, query);
  sendEvent?.("agent_step", { tool: "resume", status: "end" });

  // 🔹 STEP 2: Jobs
  sendEvent?.("agent_step", { tool: "jobs", status: "start" });
  const jobs = await getJobs(query);
  sendEvent?.("agent_step", { tool: "jobs", status: "end" });

  if (!jobs.length || !cleanContext) {
    return { recommended_roles: [] };
  }


  const resumeSignal = cleanContext.slice(0, 2000);

  // 🔹 STEP 3: Semantic Matching
  const matchedJobs = await matchJobs(resumeSignal, jobs);

  // 🔹 STEP 4: Missing Skills
  const missingSkills = await suggestImprovements(resumeSignal, jobs);

  // 🔥 Limit jobs for LLM
  const topJobs = matchedJobs.slice(0, 5);

  // 🔥 Compact jobs
  const compactJobs = topJobs.map(j => ({
    title: j.title,
    company: j.company,
    match_score: j.match_score,
    description: j.description?.slice(0, 200)
  }));

  // 🔹 STEP 5: Prompt
  const prompt = `
You are an AI career assistant.

STRICT RULES:
- Use ONLY the provided Resume Context and Jobs data
- Do NOT assume or invent anything
- If missing, say "Not found in resume"
- DO NOT hallucinate
- Output MUST be valid JSON

IMPORTANT:
- match_score is already provided
- DO NOT modify match_score
- Use match_score to rank jobs

User Preferences:
${preferencesText}

Relevant Conversation Context:
${historyText}

Resume Context:
${context}

Jobs:
${JSON.stringify(compactJobs)}

Missing Skills:
${missingSkills.join(", ")}

TASK:
- Evaluate jobs
- Select best roles
- Explain reasoning using resume evidence
- Identify missing skills
- Suggest next steps

Return JSON ONLY:
{
  "recommended_roles": [
    {
      "role": "",
      "company": "",
      "match_score": 0,
      "why": [],
      "missing_skills": [],
      "next_steps": []
    }
  ]
}
`;

  // 🔹 STEP 6: LLM CALL
  const raw = await geminiCall(prompt);

  const cleaned = raw
    .replace(/```json|```/g, "")
    .replace(/^[^\{]*\{/s, "{")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Invalid JSON:", raw);

    const fallback = matchedJobs.slice(0, 3);

    return {
      recommended_roles: fallback.map(job => ({
        role: job.title,
        company: job.company,
        match_score: job.match_score,
        why: ["Fallback: Invalid JSON"],
        missing_skills: [],
        next_steps: []
      }))
    };
  }

  const validated = ResponseSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Schema validation failed:", validated.error);

    const fallback = matchedJobs.slice(0, 3);

    return {
      recommended_roles: fallback.map(job => ({
        role: job.title,
        company: job.company,
        match_score: job.match_score,
        why: ["Fallback: Schema error"],
        missing_skills: [],
        next_steps: []
      }))
    };
  }

  return validated.data;
};