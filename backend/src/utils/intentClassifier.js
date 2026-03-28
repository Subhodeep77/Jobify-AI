import { geminiCall } from "../config/gemini.js";

const strongChatHints = [
  "summarize",
  "summary",
  "explain",
  "what",
  "why",
  "how",
  "skills",
  "projects",
  "experience",
  "education",
  "strength",
  "weakness"
];

const buildPrompt = (query) => `
You are an intent classifier.

Classify the user query into ONE of these categories:

1. CHAT → General questions about resume, skills, experience, advice
2. JOB → Anything related to jobs, roles, hiring, internships, career opportunities

Rules:
- Output ONLY one word: CHAT or JOB
- No explanation

Examples:
Query: "What are my strengths?"
Answer: CHAT

Query: "Find me backend developer jobs"
Answer: JOB

Query: "Give me the roadmap for backend developer jobs according to the resume"
Answer: CHAT

Query: "Am I suitable for software roles?"
Answer: JOB

Query: "Roadmap for the next_steps of the above roles"
Answer: CHAT

Query: "Am i a good fit for google sde III according to my resume"
Answer: CHAT

Query: "Summarize my projects"
Answer: CHAT

Now classify:

Query: "${query}"
`;

export const classifyIntent = async (query) => {
  try {
    const lower = query.toLowerCase();

    // ⚡ Step 1: Strong CHAT shortcut (safe skip)
    const isStrongChat = strongChatHints.some(word =>
      lower.includes(word)
    );

    if (isStrongChat && !lower.includes("job")) {
      
      return "CHAT"; // ✅ safe optimization
    }

    // 🧠 Step 2: Let LLM decide (for ALL ambiguous cases)
    const prompt = buildPrompt(query);
    const res = await geminiCall(prompt);

    const intent = res?.trim().toUpperCase();
    
    // 🛡️ Step 3: Safe fallback
    if (intent === "JOB") return "JOB";
    if (intent === "CHAT") return "CHAT";
    
    return "CHAT";

  } catch (err) {
    console.error("[INTENT ERROR]:", err.message);
    return "CHAT";
  }
};