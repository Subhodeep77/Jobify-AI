export function cleanResumeText(text) {
  return text
    // normalize line breaks
    .replace(/\r\n/g, "\n")

    // remove excessive newlines
    .replace(/\n{2,}/g, "\n")

    // normalize bullets
    .replace(/[•●▪]/g, "-")

    // remove extra spaces
    .replace(/\s{2,}/g, " ")

    // remove weird unicode artifacts (optional)
    .replace(/[^\x00-\x7F]/g, "")

    .trim();
}