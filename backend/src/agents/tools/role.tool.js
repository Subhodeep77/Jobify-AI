import { geminiCall } from "../../config/gemini.js";

// 🔒 Safe JSON extractor
const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

// 🔥 MAIN FUNCTION
export const extractRolesFromResume = async (resumeSum, userMessage) => {
  try {
    // 🔹 Fetch stored resume summary

    if (!resumeSum || !resumeSum.summary) {
      console.warn("[ROLE] No summary found");
      return [];
    }

    const summary = resumeSum.summary;

    const summaryText = `
Description: ${summary.description}

Skills: ${(summary.skills || []).join(", ")}

Projects: ${summary.projects}

Experience: ${summary.experience}

Education: ${summary.education}

Achievements: ${summary.achievements}

Certifications: ${summary.certifications}
`;

    // 🔥 LLM Prompt
    const prompt = `
You are an AI job role extractor.

STRICT RULES:
- Use ONLY the given resume summary and user message
- Do NOT hallucinate
- Do NOT explain anything
- Output ONLY valid JSON
- Max 5 roles
- Roles must be relevant to ANY domain (not limited to IT)

TASK:
- Identify most suitable job roles for this candidate

Resume Summary:
${summaryText}

User Message:
${userMessage}

Return JSON:
{
  "roles": []
}
`;

    const raw = await geminiCall(prompt);

    if (!raw) {
      console.warn("[ROLE] Empty LLM response");
      return [];
    }

    const parsed = extractJSON(raw);

    if (!parsed || !Array.isArray(parsed.roles)) {
      console.warn("[ROLE] JSON parse failed");
      return [];
    }

    const roles = parsed.roles
      .map(r => String(r).trim())
      .filter(Boolean)
      .slice(0, 5);

    console.log("[ROLE] Extracted roles:", roles);

    return roles;

  } catch (error) {
    console.error("[ROLE ERROR]:", error.message);

    return [];
  }
};