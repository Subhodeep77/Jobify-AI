import ResumeSummary from "../models/resumeSummary.model.js";
import { geminiCall } from "../config/gemini.js";

export const handleChatFlow = async (
  userId,
  query,
  sendEvent,
  memory = {}
) => {
  sendEvent?.("agent_step", { tool: "chat", status: "start" });

  // 🔹 STEP 1: Fetch resume summary
  const summaryDoc = await ResumeSummary.findOne({ userId });

  if (!summaryDoc || !summaryDoc.summary) {
    return {
      type: "chat",
      answer: "Resume summary not found. Please upload your resume first."
    };
  }

  const summary = summaryDoc.summary;

  // 🔹 STEP 2: Format summary (important)
  const summaryText = `
Description: ${summary.description}

Skills: ${summary.skills.join(", ")}

Projects: ${summary.projects}

Experience: ${summary.experience}

Education: ${summary.education}

Achievements: ${summary.achievements}

Certifications: ${summary.certifications}
`;

  // 🔹 STEP 3: Conversation history
  const historyText = (memory.history || [])
    .slice(-6)
    .filter(m => m.role !== "system")
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  // 🔹 STEP 4: Prompt
  const prompt = `
You are an AI resume assistant.

STRICT RULES:
- Use ONLY the provided resume summary
- Do NOT hallucinate
- If not found, say "Not found in resume"

Conversation:
${historyText}

Resume Summary:
${summaryText}

User Question:
${query}
`;

  const response = await geminiCall(prompt);

  console.log('chat response: ', response);
  

  sendEvent?.("agent_step", { tool: "chat", status: "end" });

  return {
    type: "chat",
    answer: response
  };
};