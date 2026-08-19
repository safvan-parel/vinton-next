"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pageEditPath, ROUTES } from "@/lib/admin-routes";
import { jsonError, jsonSuccess } from "@/lib/jsonResponse";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { pageSlugRequest, savePageDraftRequest } from "@/requests/pageRequest";
import { pageService } from "@/services/pageService";

function revalidatePage(slug) {
    revalidatePath(ROUTES.PAGES);
    revalidatePath(pageEditPath(slug));
    revalidatePath(`/${slug}`);
    revalidatePath(`/preview/${slug}`);
}

export async function savePageDraftAction(_prevState, formData) {
    const user = await getCurrentUser();

    if (!user) {
        return jsonError({ message: "Unauthorized" });
    }

    const result = savePageDraftRequest(formData);

    if (!result.success) {
        return jsonError({
            message: "Validation failed",
            errors: result.errors,
        });
    }

    try {
        const page = await pageService.saveDraft(result.data.slug, result.data.content, formData);
        revalidatePage(result.data.slug);
        return jsonSuccess({
            message: "Draft saved",
            data: page,
        });
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }
}

export async function publishPageAction(formData) {
    const user = await getCurrentUser();

    if (!user) {
        return jsonError({ message: "Unauthorized" });
    }

    const result = pageSlugRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid page", errors: result.errors });
    }

    try {
        await pageService.publish(result.data.slug);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidatePage(result.data.slug);
    redirect(`${pageEditPath(result.data.slug)}?status=published`);
}

export async function unpublishPageAction(formData) {
    const user = await getCurrentUser();

    if (!user) {
        return jsonError({ message: "Unauthorized" });
    }

    const result = pageSlugRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid page", errors: result.errors });
    }

    try {
        await pageService.unpublish(result.data.slug);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidatePage(result.data.slug);
    redirect(`${pageEditPath(result.data.slug)}?status=unpublished`);
}

export async function togglePageActiveAction(formData) {
    const user = await getCurrentUser();

    if (!user) {
        return jsonError({ message: "Unauthorized" });
    }

    const result = pageSlugRequest(formData);

    if (!result.success) {
        return jsonError({ message: "Invalid page", errors: result.errors });
    }

    try {
        await pageService.toggleActive(result.data.slug);
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }

    revalidatePage(result.data.slug);
    redirect(ROUTES.PAGES);
}
