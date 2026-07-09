import { processResume } from "../services/resume.service.js";

export const uploadResume = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    const result = await processResume(req.file, req.user._id);

    return res.json({
      message: "Resume uploaded successfully",
      ...result
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};