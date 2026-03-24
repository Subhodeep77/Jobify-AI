import { executeAgent } from "../services/agents.service.js";
import Memory from "../models/memory.model.js";

export const chatStream = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const userId = req.user._id;
    const message = req.body.message;

    // 🔹 Load or create memory
    let memory = await Memory.findOne({ userId });

    if (!memory) {
      memory = await Memory.create({
        userId,
        messages: [],
        preferences: {}
      });
    }

    // 🔹 Short-term memory (last 10 messages)
    const recentMessages = memory.messages.slice(-10);

    const sendEvent = (event, data) => {
      res.write(`data: ${JSON.stringify({ event, data })}\n\n`);
    };

    // 🔥 Execute agent with memory
    const result = await executeAgent(
      userId,
      message,
      sendEvent,
      {
        history: recentMessages,
        preferences: memory.preferences
      }
    );

    // 🔹 Save conversation
    memory.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: JSON.stringify(result) }
    );

    // 🔥 Keep memory bounded
    memory.messages = memory.messages.slice(-20);

    await memory.save();

    sendEvent("done", result);
    res.end();

  } catch (error) {
    console.error("Chat stream error:", error);
    res.end();
  }
};