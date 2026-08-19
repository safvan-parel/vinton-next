import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { userService } from "@/services/userService";

export async function getCurrentUser() {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const payload = verifyToken(token);
        return await userService.getUserById(payload.id);
    } catch {
        return null;
    }
}
