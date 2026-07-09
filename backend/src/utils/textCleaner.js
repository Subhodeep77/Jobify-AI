export function cleanResumeText(text) {
  return text
    
    .replace(/\r\n/g, "\n")

    
    .replace(/-|—/g, "-")

    
    .replace(/([a-z])([A-Z])/g, "$1 $2")

    
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")

    
    .replace(/([,:])([^\s])/g, "$1 $2")

    
    .replace(/[•●▪]/g, "-")

    
    .replace(/Mongo DB/g, "MongoDB")
    .replace(/Node\.js/g, "Node.js")
    .replace(/Java Script/g, "JavaScript")

    
    .replace(/\n{2,}/g, "\n")

    
    .replace(/\s{2,}/g, " ")

    
    .replace(/[^\x00-\x7F]/g, "")

    .trim();
}