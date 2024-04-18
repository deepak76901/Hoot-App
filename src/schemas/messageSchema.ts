import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(15, { message: "Content must be atleast 15 characters" })
    .max(300, {
      message: "content should not be no longer than 300 characters",
    }),
});
