"use server";

import { jsonError, jsonSuccess } from "@/lib/jsonResponse";
import { blogIdRequest } from "@/requests/blogRequest";
import { blogService } from "@/services/blogService";

export async function getBlogAction(id) {
    const result = blogIdRequest({ id });

    if (!result.success) {
        return jsonError({ message: "Invalid blog", errors: result.errors });
    }

    try {
        const blog = await blogService.getById(result.data.id);

        if (!blog.active) {
            return jsonError({ message: "Blog not found" });
        }

        return jsonSuccess({ data: blog });
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong" });
    }
}
