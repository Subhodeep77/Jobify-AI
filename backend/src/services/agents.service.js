import { runAgent } from "../agents/career.agent.js";

export const executeAgent = async (
  userId,
  message,
  sendEvent,
  memory = {}
) => {
  return runAgent(userId, message, sendEvent, memory);
};
