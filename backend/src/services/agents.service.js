import { runAgent } from "../agents/career.agent.js";

export const executeAgent = async (
  userId,
  message,
  sendEvent,
  memory = {}
) => {
  return await runAgent(userId, message, sendEvent, memory);
};
