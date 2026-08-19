import { z } from "zod";

export const pageSlugSchema = z.object({
    slug: z
        .string()
        .min(1, "Page is required")
        .regex(/^[a-z0-9-]+$/, "Invalid page slug"),
});

export const savePageDraftSchema = z.object({
    slug: pageSlugSchema.shape.slug,
    content: z.custom((value) => Boolean(value) && typeof value === "object" && !Array.isArray(value), {
        message: "Invalid page content",
    }),
});
