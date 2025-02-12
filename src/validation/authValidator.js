import { z } from "zod";

export const registerValidator = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least three characters long!" })
    .max(30, { message: "username must be at most 30 characters long!" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "username can contain letters, numbers and underscores",
    }),
  name: z
    .string()
    .min(3, { message: "full name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long!" })
    .max(15, { message: "Password cannot exceed 15 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});
