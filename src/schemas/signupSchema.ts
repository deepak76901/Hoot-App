import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "username must be atleast 4 characters")
  .max(20, "usrname should not more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username should not contain special characters");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
