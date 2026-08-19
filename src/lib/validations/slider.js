import { z } from "zod";
import { sliderUpload } from "@/lib/upload";

function isImageFile(file) {
    return file instanceof File && file.size > 0;
}

const imageFileSchema = z
    .custom((file) => isImageFile(file), { message: "Image is required" })
    .refine((file) => file.size <= sliderUpload.maxSize, {
        message: "Image must be 2MB or smaller",
    })
    .refine((file) => sliderUpload.allowedTypes.includes(file.type), {
        message: "Image must be JPG, PNG, WEBP, or GIF",
    });

const sliderFields = {
    title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or less"),
    desc: z.string().min(1, "Description is required"),
    active: z.boolean(),
};

export const createSliderSchema = z.object({
    ...sliderFields,
    image: imageFileSchema,
});

export const updateSliderSchema = z.object({
    ...sliderFields,
    image: imageFileSchema.optional(),
});

export const sliderIdSchema = z.object({
    id: z.coerce.number().int().positive("Invalid slider id"),
});
