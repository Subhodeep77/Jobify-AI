import axios from "axios";

const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

export const geminiCall = async (prompt) => {
  try {
    const res = await axios.post(
      `${URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    console.log('gemini_api has been hit')

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    return "";
  }
};