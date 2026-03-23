import { z } from "zod";

export const JobSchema = z.object({
  role: z.string(),
  company: z.string(),
  match_score: z.number().min(0).max(1),
  why: z.array(z.string()),
  missing_skills: z.array(z.string()),
  next_steps: z.array(z.string())
});

export const ResponseSchema = z.object({
  recommended_roles: z.array(JobSchema)
});