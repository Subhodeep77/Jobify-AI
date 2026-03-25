import { executeAgent } from "../services/agents.service.js";
import { classifyIntent } from "../utils/intentClassifier.js";
import { handleChatFlow } from "../services/chat.service.js";
import Memory from "../models/memory.model.js";

export const chatStream = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const userId = req.user._id;
    const message = req.body.message;

    // 🔹 Load memory
    let memory = await Memory.findOne({ userId });

    if (!memory) {
      memory = await Memory.create({
        userId,
        messages: [],
        preferences: {}
      });
    }

    const recentMessages = memory.messages.slice(-10);

    const sendEvent = (event, data) => {
      res.write(`data: ${JSON.stringify({ event, data })}\n\n`);
    };

    // 🔥 INTENT CLASSIFICATION
    const intent = await classifyIntent(message);
    console.log("[INTENT]:", intent);

    let result;

    // 🔥 ROUTING
    if (intent === "JOB") {
      result = await executeAgent(
        userId,
        message,
        sendEvent,
        {
          history: recentMessages,
          preferences: memory.preferences
        }
      );
    } else {
      result = await handleChatFlow(
        userId,
        message,
        sendEvent,
        {
          history: recentMessages,
          preferences: memory.preferences
        }
      );
    }

    // 🔹 Save memory
    memory.messages.push(
      { role: "user", content: message },
      {
        role: "assistant",
        content:
          result.type === "chat"
            ? result.answer
            : JSON.stringify(result) // job flow still structured
      }
    );

    memory.messages = memory.messages.slice(-20);

    await memory.save();

    sendEvent("done", result);
    res.end();

  } catch (error) {
    console.error("Chat stream error:", error);
    res.end();
  }
};