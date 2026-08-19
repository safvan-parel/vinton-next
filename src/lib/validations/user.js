import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().optional()
        .refine((value) => !value || value.length >= 6, {
            message: "Password must be at least 6 characters",
        }),
});