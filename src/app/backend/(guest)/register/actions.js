"use server";

import { jsonError, jsonSuccess } from "@/lib/jsonResponse";
import { validate } from "@/lib/validate";
import { createUserSchema } from "@/lib/validations/user";
import { userService } from "@/services/userService";

export async function registerAction(_prevState, formData) {
    const values = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const result = validate(createUserSchema, values);

        if (!result.success) {
            return jsonError({ message: "Validation failed", errors: result.errors, values: values });
        }

        await userService.createUser(values);

        return jsonSuccess({ message: "User created successfully" });
    } catch (err) {
        return jsonError({ message: err.message || "Something went wrong", values: values });
    }
}