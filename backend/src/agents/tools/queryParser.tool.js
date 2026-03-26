import { geminiCall } from "../../config/gemini.js";

// 🔥 MAIN FUNCTION (returns final search query string)
export const parseJobQuery = async (roles = [], userMessage = "") => {
    try {
        const rolesText = roles.length ? roles.join(" OR ") : "Software Engineer";

        const prompt = `
You are an AI job query builder.

STRICT RULES:
- Use ONLY the given roles and user message
- Do NOT hallucinate
- Output ONLY a single search query string
- No explanation
- No JSON

TASK:
Construct a clean job search query.

GUIDELINES:
- Combine roles using OR
- Include location if mentioned
- Include work type (remote/hybrid/onsite) if mentioned
- Keep query concise and valid for job search

Given Roles:
${rolesText}

User Message:
${userMessage}

Output:
A single clean job search query string
`;

        const raw = await geminiCall(prompt);

        if (!raw) {
            console.warn("[QUERY PARSER] Empty response");
            return `${rolesText} jobs`;
        }

        const query = raw
            .replace(/```.*?```/gs, "")   // remove code blocks
            .replace(/^[^a-zA-Z]+/, "")   // remove junk prefix
            .replace(/["']/g, "")
            .trim()
            .replace(/\.$/, "");          // remove trailing dot

        console.log("[FINAL QUERY]:", query);

        return query.length ? query : `${rolesText} jobs`;

    } catch (error) {
        console.error("[QUERY PARSER ERROR]:", error.message);
        return roles.length ? `${roles.join(" OR ")} jobs` : "Software Engineer jobs";
    }
};