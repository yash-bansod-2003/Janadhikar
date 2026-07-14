import { z } from "zod";

const configurationSchema = z.object({
  apiBaseUrl: z.url().default("http://localhost:5000"),
});

export type Configuration = z.infer<typeof configurationSchema>;

export const configuration = {
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
};

configurationSchema.parse(configuration);
