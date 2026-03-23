import { retrieveContext } from "../../services/rag.service.js";

export const getResumeContext = async (userId, query) => {
  return await retrieveContext(userId, query);
};