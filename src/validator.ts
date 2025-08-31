import z from "zod";

export const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
  language: z.enum(["English", "Sindhi", "Vietnamese"]),
  bio: z.string().optional(),
  version: z.number().min(1, "Version must be >= 1"),
});

export type PersonFormValues = z.infer<typeof personSchema>;