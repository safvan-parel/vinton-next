"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";
import { jsonError } from "@/lib/jsonResponse";
import { validate } from "@/lib/validate";
import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/authService";

export async function loginAction(_prevState, formData) {
    const values = {
        email: formData.get("email") || "",
        password: formData.get("password") || "",
        rememberMe: formData.get("rememberMe") === "on",
    };

    try {
        const result = validate(loginSchema, values);

        if (!result.success) {
            return jsonError({
                message: "Validation failed",
                errors: result.errors,
                values: {
                    email: values.email,
                    rememberMe: values.rememberMe,
                },
            });
        }

        const { email, password, rememberMe } = result.data;
        const loginResult = await authService.login(email, password, { rememberMe });

        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        };

        if (loginResult.maxAge != null) {
            cookieOptions.maxAge = loginResult.maxAge;
        }

        cookieStore.set("token", loginResult.token, cookieOptions);
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
            values: {
                email: values.email,
                rememberMe: values.rememberMe,
            },
        });
    }

    redirect(ROUTES.BACKEND);
}
