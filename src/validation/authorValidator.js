import { z } from "zod";

export const authorValidation = z.object({
  name: z
    .string()
    .min(3, { message: "full name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z
    .string()
    .min(10, { message: "bio must be at least 10 characters long!" }),
});
