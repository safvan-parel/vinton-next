import { validate } from "@/lib/validate";
import { blogIdSchema, createBlogSchema, updateBlogSchema } from "@/lib/validations/blog";

function isFormData(input) {
    return typeof FormData !== "undefined" && input instanceof FormData;
}

function readValue(input, key, fallback = "") {
    if (isFormData(input)) {
        return input.get(key) ?? fallback;
    }

    return input?.[key] ?? fallback;
}

function readActive(input) {
    const value = readValue(input, "active", false);

    if (typeof value === "boolean") {
        return value;
    }

    return value === "on" || value === "true" || value === "1";
}

function readImage(input, key) {
    const file = readValue(input, key, undefined);

    if (!file || typeof file === "string" || file.size === 0) {
        return undefined;
    }

    return file;
}

function readImages(input) {
    if (isFormData(input)) {
        return input.getAll("images").filter((file) => file instanceof File && file.size > 0);
    }

    if (!Array.isArray(input?.images)) {
        return [];
    }

    return input.images.filter((file) => file instanceof File && file.size > 0);
}

function readRemoveImages(input) {
    if (isFormData(input)) {
        return input.getAll("removeImages").map(String).filter(Boolean);
    }

    if (!Array.isArray(input?.removeImages)) {
        return [];
    }

    return input.removeImages.map(String).filter(Boolean);
}

function blogValues(input) {
    return {
        title: String(readValue(input, "title", "")).trim(),
        desc1: String(readValue(input, "desc1", "")).trim(),
        desc2: String(readValue(input, "desc2", "")).trim(),
        active: readActive(input),
        primaryImage: readImage(input, "primaryImage"),
        images: readImages(input),
        removeImages: readRemoveImages(input),
    };
}

function fail(result, values) {
    return {
        success: false,
        errors: result.errors,
        values: {
            title: values.title,
            desc1: values.desc1,
            desc2: values.desc2,
            active: values.active,
        },
    };
}

export function createBlogRequest(input) {
    const values = blogValues(input);
    const result = validate(createBlogSchema, values);

    if (!result.success) {
        return fail(result, values);
    }

    return { success: true, data: result.data };
}

export function updateBlogRequest(input) {
    const values = blogValues(input);
    const result = validate(updateBlogSchema, values);

    if (!result.success) {
        return fail(result, values);
    }

    return { success: true, data: result.data };
}

export function blogIdRequest(input) {
    const result = validate(blogIdSchema, {
        id: readValue(input, "id"),
    });

    if (!result.success) {
        return { success: false, errors: result.errors };
    }

    return { success: true, data: result.data };
}
