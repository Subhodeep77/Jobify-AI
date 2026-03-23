import axios from "axios";

export const fetchJobs = async (query) => {
  try {
    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_jobs",
        q: query,
        api_key: process.env.SERP_API_KEY
      }
    });

    const jobs = res.data.jobs_results || [];

    const cleanedJobs = jobs
      .filter(job => job.title && job.company_name)
      .slice(0, 5)
      .map(job => ({
        id: job.job_id || `${job.title}_${job.company_name}`,
        title: job.title,
        company: job.company_name,
        location: job.location || "N/A",
        description: (job.description || "").slice(0, 500),
        link: job.related_links?.[0]?.link || "",
        source: "serpapi"
      }));

    return cleanedJobs;

  } catch (error) {
    console.error("Job fetch error:", error.response?.data || error.message);
    return [];
  }
};