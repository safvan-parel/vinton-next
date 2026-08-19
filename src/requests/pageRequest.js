import { validate } from "@/lib/validate";
import { pageSlugSchema, savePageDraftSchema } from "@/lib/validations/page";

function isFormData(input) {
    return typeof FormData !== "undefined" && input instanceof FormData;
}

function readValue(input, key, fallback = "") {
    if (isFormData(input)) {
        return input.get(key) ?? fallback;
    }

    return input?.[key] ?? fallback;
}

export function pageSlugRequest(input) {
    const result = validate(pageSlugSchema, {
        slug: String(readValue(input, "slug", "")).trim(),
    });

    if (!result.success) {
        return { success: false, errors: result.errors };
    }

    return { success: true, data: result.data };
}

export function savePageDraftRequest(input) {
    let content = readValue(input, "content", "{}");

    if (typeof content === "string") {
        try {
            content = JSON.parse(content);
        } catch {
            return {
                success: false,
                errors: { content: ["Invalid page content"] },
            };
        }
    }

    if (!content || typeof content !== "object" || Array.isArray(content)) {
        return {
            success: false,
            errors: { content: ["Invalid page content"] },
        };
    }

    const result = validate(savePageDraftSchema, {
        slug: String(readValue(input, "slug", "")).trim(),
        content,
    });

    if (!result.success) {
        return { success: false, errors: result.errors };
    }

    return { success: true, data: result.data };
}
