import { z } from "zod";
import { blogUpload } from "@/lib/upload";

const MAX_GALLERY_IMAGES = 10;

function isImageFile(file) {
    return file instanceof File && file.size > 0;
}

const imageFileSchema = z
    .custom((file) => isImageFile(file), { message: "Primary image is required" })
    .refine((file) => file.size <= blogUpload.maxSize, {
        message: "Image must be 2MB or smaller",
    })
    .refine((file) => blogUpload.allowedTypes.includes(file.type), {
        message: "Image must be JPG, PNG, WEBP, or GIF",
    });

const galleryImageSchema = z
    .custom((file) => isImageFile(file), { message: "Invalid image file" })
    .refine((file) => file.size <= blogUpload.maxSize, {
        message: "Each image must be 2MB or smaller",
    })
    .refine((file) => blogUpload.allowedTypes.includes(file.type), {
        message: "Images must be JPG, PNG, WEBP, or GIF",
    });

const blogFields = {
    title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
    desc1: z.string().min(1, "Description 1 is required"),
    desc2: z.string().min(1, "Description 2 is required"),
    active: z.boolean(),
    images: z.array(galleryImageSchema).max(MAX_GALLERY_IMAGES, "You can upload up to 10 images").optional().default([]),
    removeImages: z.array(z.string()).optional().default([]),
};

export const createBlogSchema = z.object({
    ...blogFields,
    primaryImage: imageFileSchema,
});

export const updateBlogSchema = z.object({
    ...blogFields,
    primaryImage: imageFileSchema.optional(),
});

export const blogIdSchema = z.object({
    id: z.coerce.number().int().positive("Invalid blog id"),
});
