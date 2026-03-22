import { Document } from "langchain/document";

const splitIntoChunks = (text, size = 500, overlap = 100) => {
  const chunks = [];

  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
};

// 🔹 Main chunking function
export function chunkResumeText(cleanText) {
  const SECTION_REGEX =
    /(EXPERIENCE|PROJECTS|SKILLS|EDUCATION|SUMMARY|CERTIFICATIONS|ACHIEVEMENTS)/i;

  const parts = cleanText.split(SECTION_REGEX);

  const documents = [];

  for (let i = 1; i < parts.length; i += 2) {
    const sectionName = parts[i]?.toLowerCase();
    const content = parts[i + 1];

    if (!content) continue;

    const chunks = splitIntoChunks(content);

    for (const chunk of chunks) {
      documents.push(
        new Document({
          pageContent: chunk.trim(),
          metadata: {
            section: sectionName,
            length: chunk.length
          }
        })
      );
    }
  }

  return documents;
}