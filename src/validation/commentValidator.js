import { z } from "zod";

export const commentValidator = z.object({
  content: z.string().trim(),
  user_id: z.string().trim(),
  article_id: z.string().trim(),
});
