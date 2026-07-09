import crypto from "crypto";
import ResumeSummary from "../models/resumeSummary.model.js";
import { geminiCall } from "../config/gemini.js";


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


const generateHash = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};


const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};


export const generateResumeSummary = async ({ userId, cleanText }) => {
  try {
    if (!cleanText || !cleanText.trim()) {
      throw new Error("Invalid resume text");
    }

    const rawTextHash = generateHash(cleanText);

    
    const existing = await ResumeSummary.findOne({ userId });

    if (existing && existing.rawTextHash === rawTextHash) {
      console.log("[SUMMARY] Using cached summary");
      return existing.summary;
    }
    

    const MAX_CHARS = 12000;
    const trimmedText =
      cleanText.length > MAX_CHARS
        ? cleanText.slice(0, MAX_CHARS)
        : cleanText;

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


    if (!response) {
      throw new Error("Gemini returned empty response");
    }

    let parsed = extractJSON(response);

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

    const normalized = normalizeSummary(parsed);

    
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