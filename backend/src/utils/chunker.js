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

      for (let line of content) {
        const isNewProject =
          !isBullet(line) &&
          !isTechLine(line) &&
          currentProject.length > 0;

        // 🔥 push previous project
        if (isNewProject) {
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

      // 🔥 push last project
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