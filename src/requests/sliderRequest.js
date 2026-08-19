import { validate } from "@/lib/validate";
import { createSliderSchema, sliderIdSchema, updateSliderSchema } from "@/lib/validations/slider";

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

function readImage(input) {
    const file = readValue(input, "image", undefined);

    if (!file || typeof file === "string" || file.size === 0) {
        return undefined;
    }

    return file;
}

function sliderValues(input) {
    return {
        title: String(readValue(input, "title", "")).trim(),
        desc: String(readValue(input, "desc", "")).trim(),
        active: readActive(input),
        image: readImage(input),
    };
}

function fail(result, values) {
    return {
        success: false,
        errors: result.errors,
        values: {
            title: values.title,
            desc: values.desc,
            active: values.active,
        },
    };
}

export function createSliderRequest(input) {
    const values = sliderValues(input);
    const result = validate(createSliderSchema, values);

    if (!result.success) {
        return fail(result, values);
    }

    return { success: true, data: result.data };
}

export function updateSliderRequest(input) {
    const values = sliderValues(input);
    const result = validate(updateSliderSchema, values);

    if (!result.success) {
        return fail(result, values);
    }

    return { success: true, data: result.data };
}

export function sliderIdRequest(input) {
    const result = validate(sliderIdSchema, {
        id: readValue(input, "id"),
    });

    if (!result.success) {
        return { success: false, errors: result.errors };
    }

    return { success: true, data: result.data };
}
