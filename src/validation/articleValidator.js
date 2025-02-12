import { z } from "zod";

export const articleValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long!" }),
  content: z
    .string()
    .min(10, { message: "Content should be at least 10 characters long!" }),
  author_id: z.string().trim(),
  category_id: z.string().trim(),
});
