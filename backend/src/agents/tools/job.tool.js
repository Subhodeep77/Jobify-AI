import { fetchJobs } from "../../services/job.service.js";

export const getJobs = async (query) => {
  return await fetchJobs(query);
};