import crypto from "crypto";
import ResumeSummary from "../models/resumeSummary.model.js";
import { geminiCall } from "../config/gemini.js";

// 🔒 Normalize + validate schema
const normalizeSummary = (data) => {
  return {
    description: data?.description || "",
    skills: Array.isArray(data?.skills) ? data.skills : [],
    projects: data?.projects || "",
    experience: data?.experience || "",
    education: data?.education || "",
    achievements: data?.achievements || "",
    certifications: data?.certifications || "",
  };
};

// 🔒 Hash generator (for deduplication)
const generateHash = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

// 🔒 Safe JSON extractor (strict)
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
export const generateResumeSummary = async ({ userId, cleanText }) => {
  try {
    if (!cleanText || !cleanText.trim()) {
      throw new Error("Invalid resume text");
    }

    const rawTextHash = generateHash(cleanText);

    // 🔍 Check existing summary
    const existing = await ResumeSummary.findOne({ userId });

    if (existing && existing.rawTextHash === rawTextHash) {
      console.log("[SUMMARY] Using cached summary");
      return existing.summary;
    }
    

    // ✂️ Trim to safe limit
    const MAX_CHARS = 12000;
    const trimmedText =
      cleanText.length > MAX_CHARS
        ? cleanText.slice(0, MAX_CHARS)
        : cleanText;

    // 🧠 Prompt (STRICT JSON ONLY)
    const prompt = `
You are an expert resume analyzer.

Generate a structured summary from the resume.

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- No extra text
- No hallucination

FORMAT:
{
  "description": "2-3 line professional summary",
  "skills": ["skill1", "skill2"],
  "projects": "key projects summary",
  "experience": "experience summary",
  "education": "education summary",
  "achievements": "achievements summary",
  "certifications": "certifications summary"
}

RESUME:
${trimmedText}
`;

    const response = await geminiCall(prompt);

    //console.log('summary: ', response);

    if (!response) {
      throw new Error("Gemini returned empty response");
    }

    let parsed = extractJSON(response);

    // ⚠️ Hard fallback
    if (!parsed) {
      console.warn("[SUMMARY] JSON parsing failed, fallback applied");

      parsed = {
        description: trimmedText.slice(0, 300),
        skills: [],
        projects: "",
        experience: "",
        education: "",
      };
    }

    //console.log('summaryP: ', parsed);

    const normalized = normalizeSummary(parsed);

    // 💾 Upsert summary
    const saved = await ResumeSummary.findOneAndUpdate(
      { userId },
      {
        userId,
        summary: normalized,
        rawTextHash,
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    console.log("[SUMMARY] Stored");
    console.log("[SUMMARY N]:", normalized);

    return saved.summary;
  } catch (error) {
    console.error("[SUMMARY ERROR]:", error.message);

    return {
      description: "",
      skills: [],
      projects: "",
      experience: "",
      education: "",
      achievements: "",
      certifications: "",
    };
  }
};