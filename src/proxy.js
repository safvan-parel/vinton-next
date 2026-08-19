import { NextResponse } from "next/server";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { apiError } from "@/lib/apiResponse";
import { ROUTES } from "@/lib/admin-routes";

const GUEST_PATHS = [ROUTES.LOGIN];

export function proxy(req) {
    const { pathname } = req.nextUrl;
    const user = authMiddleware(req);

    if (pathname === "/backend" || pathname === "/backend/") {
        return NextResponse.redirect(new URL(user ? ROUTES.BACKEND : ROUTES.LOGIN, req.url));
    }

    if (pathname === ROUTES.REGISTER || pathname === `${ROUTES.REGISTER}/`) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }

    if (GUEST_PATHS.includes(pathname)) {
        if (user) {
            return NextResponse.redirect(new URL(ROUTES.BACKEND, req.url));
        }

        return NextResponse.next();
    }

    if (!user) {
        if (pathname.startsWith("/api/")) {
            return apiError({ status: 401, message: "Unauthorized" });
        }

        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }

    const headers = new Headers(req.headers);

    headers.set("x-user-id", String(user.id));
    headers.set("x-user-email", user.email);

    return NextResponse.next({
        request: {
            headers,
        },
    });
}

export const config = {
    matcher: ["/backend", "/backend/:path*", "/preview/:path*", "/api/users/:path*", "/api/sliders", "/api/sliders/:path*", "/api/blogs", "/api/blogs/:path*"],
};
