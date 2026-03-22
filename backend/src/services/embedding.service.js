import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export const embedText = async (text, taskType = "RETRIEVAL_DOCUMENT") => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      taskType,
      outputDimensionality: 768
    }
  });

  return response.embeddings[0].values;
};


export const embedBatch = async (texts) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 768
    }
  });

  return response.embeddings.map(e => e.values);
};