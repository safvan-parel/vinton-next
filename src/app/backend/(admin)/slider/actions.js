"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";
import { jsonError } from "@/lib/jsonResponse";
import { createSliderRequest, sliderIdRequest, updateSliderRequest } from "@/requests/sliderRequest";
import { sliderService } from "@/services/sliderService";

function revalidateSliders() {
    revalidatePath(ROUTES.SLIDER);
}

export async function createSliderAction(_prevState, formData) {
    const result = createSliderRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Validation failed", errors: result.errors, values: result.values });
    }

    try {
        await sliderService.create(result.data);
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
            values: result.values || {
                title: formData.get("title") || "",
                desc: formData.get("desc") || "",
                active: formData.get("active") === "on",
            },
        });
    }

    revalidateSliders();
    redirect(ROUTES.SLIDER);
}

export async function updateSliderAction(_prevState, formData) {
    const idResult = sliderIdRequest(formData);

    if (!idResult.success) {
        return jsonError({ message: "Invalid slider" });
    }

    const result = updateSliderRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Validation failed", errors: result.errors, values: result.values });
    }

    try {
        await sliderService.update(idResult.data.id, result.data);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong", values: result.values });
    }

    revalidateSliders();
    redirect(ROUTES.SLIDER);
}

export async function deleteSliderAction(formData) {
    const result = sliderIdRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid slider", errors: result.errors });
    }

    try {
        await sliderService.delete(result.data.id);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidateSliders();
    redirect(ROUTES.SLIDER);
}

export async function changeSliderStatusAction(formData) {
    const result = sliderIdRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid slider", errors: result.errors });
    }

    try {
        await sliderService.changeStatus(result.data.id);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidateSliders();
    redirect(ROUTES.SLIDER);
}
