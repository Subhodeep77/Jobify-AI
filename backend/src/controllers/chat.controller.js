import { executeAgent } from "../services/agents.service.js";
import { classifyIntent } from "../utils/intentClassifier.js";
import { handleChatFlow } from "../services/chat.service.js";
import Memory from "../models/memory.model.js";

export const chatStream = async (req, res) => {

  const sendEvent = (event, data) => {
    if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({ event, data })}\n\n`
      );
    }
  };

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
    if (
      result?.type === "jobs" &&
      (!result.recommended_roles || result.recommended_roles.length === 0)
    ) {
      result = {
        type: "chat",
        answer:
          "No job recommendations could be generated at the moment. Please try again later.",
      };
    }

    const assistantMessage =
      result?.type === "jobs"
        ? {
          role: "assistant",
          type: "jobs",
          content: null,
          data: result.recommended_roles,
        }
        : result?.type === "chat"
          ? {
            role: "assistant",
            type: "chat",
            content:
              result.answer ||
              "AI service is temporarily unavailable. Please try again in a moment.",
            data: null,
          }
          : {
            role: "assistant",
            type: "chat",
            content:
              "⚠️ Unexpected response from server. Please try again.",
            data: null,
          };

    memory.messages.push(
      {
        role: "user",
        type: "chat",
        content: message,
        data: null,
      },
      assistantMessage
    );

    memory.messages = memory.messages.slice(-20);

    await memory.save();


    sendEvent("done", result);
    res.end();

  } catch (error) {
    sendEvent("error", {
      success: false,
      message: "Internal server error"
    });

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