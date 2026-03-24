import { Document } from "@langchain/core/documents";

const SECTION_HEADERS = [
  "education",
  "projects",
  "skills",
  "achievements",
  "leadership and volunteering",
  "profiles"
];

// detect section header
const isSection = (line) => {
  const lower = line.toLowerCase().trim();
  return SECTION_HEADERS.includes(lower);
};

export function chunkResumeText(cleanText) {
  const lines = cleanText.split("\n");

  const sections = {};
  let currentSection = "general";

  // 🔹 Step 1: Build structured sections
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isSection(trimmed)) {
      currentSection = trimmed.toLowerCase();
      sections[currentSection] = [];
      continue;
    }

    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }

    sections[currentSection].push(trimmed);
  }

  const documents = [];

  // 🔥 Step 2: Smart section handling
  for (const [section, content] of Object.entries(sections)) {

    // =========================
    // 🚀 PROJECT GROUPING (FIXED)
    // =========================
    if (section === "projects") {
      let currentProject = [];

      const isBullet = (line) =>
        line.startsWith("-") || line.startsWith("•");

      const isTechLine = (line) =>
        line.toLowerCase().startsWith("tech");

      const isProjectTitle = (line) =>
        !isBullet(line) &&
        !isTechLine(line) &&
        (
          line.toLowerCase().includes("github") ||
          line.toLowerCase().includes("project") ||
          line.includes("|") ||
          line.length < 120 // short titles
        );

      for (let line of content) {

        // 🔥 new project only if clearly a title
        if (isProjectTitle(line) && currentProject.length > 0) {
          documents.push(
            new Document({
              pageContent: currentProject.join("\n"),
              metadata: { section }
            })
          );
          currentProject = [];
        }

        currentProject.push(line);
      }

      if (currentProject.length > 0) {
        documents.push(
          new Document({
            pageContent: currentProject.join("\n"),
            metadata: { section }
          })
        );
      }
    }
    // =========================
    // 🧠 SKILLS (FULL BLOCK)
    // =========================
    else if (section === "skills") {
      documents.push(
        new Document({
          pageContent: content.join("\n"),
          metadata: { section }
        })
      );
    }

    // =========================
    // 🏆 ACHIEVEMENTS + LEADERSHIP
    // =========================
    else if (
      section === "achievements" ||
      section === "leadership and volunteering"
    ) {
      documents.push(
        new Document({
          pageContent: content.join("\n"),
          metadata: { section }
        })
      );
    }

    // =========================
    // 📄 GENERAL / EDUCATION / OTHERS
    // =========================
    else {
      documents.push(
        new Document({
          pageContent: content.join("\n"),
          metadata: { section }
        })
      );
    }
  }

  return documents;
}