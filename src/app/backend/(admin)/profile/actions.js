"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { jsonError, jsonSuccess } from "@/lib/jsonResponse";
import { validate } from "@/lib/validate";
import { updateProfileSchema } from "@/lib/validations/user";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { userService } from "@/services/userService";
import { generateToken } from "@/lib/auth/jwt";

export async function updateProfileAction(_prevState, formData) {
    const values = {
        name: formData.get("name") || "",
        email: formData.get("email") || "",
        password: formData.get("password") || "",
    };

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return jsonError({ message: "Unauthorized", values });
        }

        const result = validate(updateProfileSchema, values);

        if (!result.success) {
            return jsonError({
                message: "Validation failed",
                errors: result.errors,
                values: {
                    name: values.name,
                    email: values.email,
                },
            });
        }

        const payload = {
            name: result.data.name,
            email: result.data.email,
        };

        if (result.data.password) {
            payload.password = result.data.password;
        }

        const user = await userService.updateProfile(currentUser.id, payload);

        if (user.email !== currentUser.email) {
            const cookieStore = await cookies();

            cookieStore.set("token", generateToken(user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
        }

        revalidatePath("/backend", "layout");

        return jsonSuccess({
            message: "Profile updated successfully",
            data: user,
        });
    } catch (err) {
        return jsonError({
            message: err.message || "Something went wrong",
            values: {
                name: values.name,
                email: values.email,
            },
        });
    }
}
