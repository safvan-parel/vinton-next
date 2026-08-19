import { verifyToken } from "@/lib/auth/jwt";

export function authMiddleware(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        return verifyToken(token);
    } catch (error) {
        return null;
    }
}