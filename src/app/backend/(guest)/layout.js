import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth/jwt";
import { ROUTES } from "@/lib/admin-routes";
import "@/components/backend/admin.css";

export default async function AuthLayout({ children }) {
    const token = (await cookies()).get("token")?.value;
    let isLoggedIn = false;

    if (token) {
        try {
            verifyToken(token);
            isLoggedIn = true;
        } catch {
            isLoggedIn = false;
        }
    }

    if (isLoggedIn) {
        redirect(ROUTES.BACKEND);
    }

    return children;
}
