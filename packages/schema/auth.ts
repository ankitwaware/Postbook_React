import z from "zod";

const requiredString = z
  .string()
  .trim()
  .min(1, "Required")
  .max(256, "Not more than 256 characters");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  displayName: requiredString,
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = signUpSchema.pick({ email: true, password: true });

export type loginValues = z.infer<typeof loginSchema>;
