import { z } from "zod";

export const categoryValidator = z.object({
  name: z.string(),
  description: z
    .string()
    .min(5, { message: "description must be at least 5 characters long! " }),
});
