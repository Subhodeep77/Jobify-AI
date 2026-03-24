export function cleanResumeText(text) {
  return text
    // normalize line breaks
    .replace(/\r\n/g, "\n")

    // normalize dashes (important for bullets)
    .replace(/–|—/g, "-")

    // add space between lowercase → uppercase
    .replace(/([a-z])([A-Z])/g, "$1 $2")

    // add space between letters and numbers
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")

    // fix missing spaces after punctuation
    .replace(/([,:])([^\s])/g, "$1 $2")

    // normalize bullets
    .replace(/[•●▪]/g, "-")

    // fix "MongoDB" type splits (optional tuning)
    .replace(/Mongo DB/g, "MongoDB")
    .replace(/Node\.js/g, "Node.js")
    .replace(/Java Script/g, "JavaScript")

    // remove excessive newlines
    .replace(/\n{2,}/g, "\n")

    // remove extra spaces
    .replace(/\s{2,}/g, " ")

    // remove weird unicode artifacts
    .replace(/[^\x00-\x7F]/g, "")

    .trim();
}