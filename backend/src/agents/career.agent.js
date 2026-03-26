import { geminiCall } from "../config/gemini.js";
import { getJobs } from "./tools/job.tool.js";
import { matchJobs } from "./tools/matcher.tool.js";
import { suggestImprovements } from "./tools/improvement.tool.js";
import { ResponseSchema } from "../schemas/agent.schema.js";
import ResumeSummary from "../models/resumeSummary.model.js";
import { extractRolesFromResume } from "./tools/role.tool.js";
import { parseJobQuery } from "./tools/queryParser.tool.js";

const calculateConfidence = (matchScore, missingSkills) => {
  const penalty = Math.min(missingSkills.length * 0.08, 0.6);
  return Number((matchScore * (1 - penalty)).toFixed(3));
};

export const runAgent = async (userId, query, sendEvent, memory = {}) => {

  const historyText = (memory.history || [])
    .slice(-6)
    .filter(m => m.role !== "system")
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  console.log('historyText: ', historyText)

  // 🔹 STEP 1: Resume Context
  sendEvent?.("agent_step", { tool: "resume", status: "start" });
  const resumeContext = await ResumeSummary.findOne({ userId });
  sendEvent?.("agent_step", { tool: "resume", status: "end" });

  if (!resumeContext || !resumeContext.summary) {
    return { recommended_roles: [] };
  }

  // 🔹 STEP 2: Jobs
  sendEvent?.("agent_step", { tool: "jobs", status: "start" });
  const roles = await extractRolesFromResume(resumeContext, query);
  const safeRoles = roles.length ? roles : ["Software Engineer"];
  const new_query = await parseJobQuery(safeRoles, query)
  console.log("[ROLES]:", safeRoles);
  console.log("[JOB QUERY]:", new_query);
  const jobs = await getJobs(new_query);
  console.log('jobs: ', jobs)
  if (!jobs.length) {
    return { recommended_roles: [] };
  }
  sendEvent?.("agent_step", { tool: "jobs", status: "end" });


  const summary = resumeContext?.summary;

  const resumeSignal = `
Description: ${summary.description}

Skills: ${(summary.skills || []).join(", ")}

Projects: ${summary.projects}

Experience: ${summary.experience}

Education: ${summary.education}

Achievements: ${summary.achievements}

Certifications: ${summary.certifications}
`.slice(0, 2000);
  console.log('resume signal: ', resumeSignal);


  // 🔹 STEP 3: Semantic Matching
  const matchedJobs = await matchJobs(resumeSignal, jobs);

  console.log("💼 Jobs fetched:", jobs);
  console.log("📊 Matched jobs:", matchedJobs);

  // 🔹 STEP 4: Missing Skills
  const missingSkills = await suggestImprovements(resumeSignal, jobs);
  console.log('missingSkills: ', missingSkills);


  // 🔥 Limit jobs for LLM
  const topJobs = matchedJobs.slice(0, 5);
  console.log('Topjobs: ', topJobs)


  // 🔥 Compact jobs
  const compactJobs = topJobs.map(j => ({
    title: j.title,
    company: j.company,
    match_score: j.match_score,
    description: j.description?.slice(0, 200),
    apply_link: j.link || null
  }));

  console.log('Compactjobs: ', compactJobs)

  // 🔹 STEP 5: Prompt
  const prompt = `
You are an AI career assistant.

STRICT RULES:
- Use ONLY the provided Resume Context and Jobs data
- Do NOT assume or invent anything
- If missing, say "Not found in resume"
- DO NOT hallucinate
- Output MUST be valid JSON
- Use apply_link EXACTLY as provided in Jobs
- If apply_link is missing, return null
- DO NOT generate or modify apply_link

IMPORTANT:
- match_score is already provided
- DO NOT modify match_score
- Use match_score to rank jobs

Relevant Conversation Context:
${historyText}

Resume Summary:
${resumeSignal}

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
      "apply_link": null,
      "why": [],
      "missing_skills": [],
      "next_steps": []
    }
  ]
}
`;

  // 🔹 STEP 6: LLM CALL
  const raw = await geminiCall(prompt);
  console.log('gemini_res_raw', raw)

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
        apply_link: job.link || null,
        confidence_score: calculateConfidence(
          job.match_score,
          []
        ),
        why: ["Fallback: Invalid JSON"],
        missing_skills: [],
        next_steps: []
      }))
    };
  }

  // 🔥 Inject confidence BEFORE validation
  const enrichedBeforeValidation = {
    recommended_roles: (parsed.recommended_roles || []).map(job => ({
      ...job,
      confidence_score: calculateConfidence(
        job.match_score,
        job.missing_skills || []
      )
    }))
  };

  // ✅ NOW validate
  const validated = ResponseSchema.safeParse(enrichedBeforeValidation);

  if (!validated.success) {
    console.error("Schema validation failed:", validated.error);

    const fallback = matchedJobs.slice(0, 3);

    return {
      recommended_roles: fallback.map(job => ({
        role: job.title,
        company: job.company,
        match_score: job.match_score,
        apply_link: job.link || null,
        confidence_score: calculateConfidence(
          job.match_score,
          []
        ),
        why: ["Fallback: Schema error"],
        missing_skills: [],
        next_steps: []
      }))
    };
  }

  // ✅ SORT AFTER VALIDATION
  const sorted = validated.data.recommended_roles.sort(
    (a, b) => b.confidence_score - a.confidence_score
  );

  console.log("sorted:", sorted);

  return { recommended_roles: sorted };
}