"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";
import { jsonError } from "@/lib/jsonResponse";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { blogIdRequest, createBlogRequest, updateBlogRequest } from "@/requests/blogRequest";
import { blogService } from "@/services/blogService";

function revalidateBlogs() {
    revalidatePath(ROUTES.BLOGS);
}

function formValues(formData) {
    return {
        title: formData.get("title") || "",
        desc1: formData.get("desc1") || "",
        desc2: formData.get("desc2") || "",
        active: formData.get("active") === "on",
    };
}

export async function createBlogAction(_prevState, formData) {
    const user = await getCurrentUser();

    if (!user) {
        return jsonError({ message: "Unauthorized", values: formValues(formData) });
    }

    const result = createBlogRequest(formData);

    if (!result.success) {
        return jsonError({
            message: "Validation failed",
            errors: result.errors,
            values: result.values,
        });
    }

    try {
        await blogService.create({
            ...result.data,
            createdById: user.id,
        });
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
            values: result.values || formValues(formData),
        });
    }

    revalidateBlogs();
    redirect(ROUTES.BLOGS);
}

export async function updateBlogAction(_prevState, formData) {
    const idResult = blogIdRequest(formData);

    if (!idResult.success) {
        return jsonError({ message: "Invalid blog" });
    }

    const result = updateBlogRequest(formData);

    if (!result.success) {
        return jsonError({
            message: "Validation failed",
            errors: result.errors,
            values: result.values,
        });
    }

    try {
        await blogService.update(idResult.data.id, result.data);
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
            values: result.values,
        });
    }

    revalidateBlogs();
    redirect(ROUTES.BLOGS);
}

export async function deleteBlogAction(formData) {
    const result = blogIdRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid blog", errors: result.errors });
    }

    try {
        await blogService.delete(result.data.id);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidateBlogs();
    redirect(ROUTES.BLOGS);
}

export async function changeBlogStatusAction(formData) {
    const result = blogIdRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid blog", errors: result.errors });
    }

    try {
        await blogService.changeStatus(result.data.id);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidateBlogs();
    redirect(ROUTES.BLOGS);
}
