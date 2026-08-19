"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";
import { jsonError } from "@/lib/jsonResponse";
import { authService } from "@/services/authService";

export async function logoutAction() {
    try {
        await authService.logout();

        const cookieStore = await cookies();
        cookieStore.delete("token");
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
        });
    }

    redirect(ROUTES.LOGIN);
}
