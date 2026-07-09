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

    
    let memory = await Memory.findOne({ userId });

    if (!memory) {
      memory = await Memory.create({
        userId,
        messages: [],
      });
    }

    const recentMessages = memory.messages.slice(-10);

    const sendEvent = (event, data) => {
      res.write(`data: ${JSON.stringify({ event, data })}\n\n`);
    };

    
    const intent = await classifyIntent(message);
    console.log("[INTENT]:", intent);

    let result;

    
    if (intent === "JOB") {
      result = await executeAgent(
        userId,
        message,
        sendEvent,
        {
          history: recentMessages,
        }
      );
    } else {
      result = await handleChatFlow(
        userId,
        message,
        sendEvent,
        {
          history: recentMessages,
        }
      );
    }

    
    memory.messages.push(
      {
        role: "user",
        type: "chat",
        content: message,
        data: null,
      },

      
      result?.type === "chat"
        ? {
          role: "assistant",
          type: "chat",
          content: result.answer || "No response generated",
          data: null,
        }

        
        : result?.type === "jobs"
          ? {
            role: "assistant",
            type: "jobs",
            content: null,
            data: result.recommended_roles || [],
          }

          
          : {
            role: "assistant",
            type: "chat",
            content: "⚠️ Unexpected response from server. Please try again.",
            data: null,
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

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const memory = await Memory.findOne({ userId });

    if (!memory) {
      return res.json({ messages: [] });
    }

    return res.json({
      messages: memory.messages, 
    });

  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Server error" });
  }
};