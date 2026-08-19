"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/admin-routes";
import { logoutAction } from "@/app/backend/(guest)/logout/actions";
import AdminForm from "@/components/backend/AdminForm";

const titles = {
    [ROUTES.BACKEND]: "Dashboard",
    [ROUTES.SLIDER]: "Slider",
    [ROUTES.BLOGS]: "Blogs",
    [ROUTES.PAGES]: "Pages",
    [ROUTES.SETTINGS]: "Settings",
    [ROUTES.PROFILE]: "Update Profile",
};

function getTitle(pathname) {
    if (titles[pathname]) {
        return titles[pathname];
    }

    if (pathname.startsWith(ROUTES.SLIDER)) {
        if (pathname.endsWith("/create")) {
            return "Add Slider";
        }

        if (pathname.endsWith("/edit")) {
            return "Edit Slider";
        }

        return "Slider";
    }

    if (pathname.startsWith(ROUTES.BLOGS)) {
        if (pathname.endsWith("/create")) {
            return "Add Blog";
        }

        if (pathname.endsWith("/edit")) {
            return "Edit Blog";
        }

        return "Blogs";
    }

    if (pathname.startsWith(ROUTES.PAGES)) {
        if (pathname.endsWith("/edit")) {
            return "Edit Page";
        }

        return "Pages";
    }

    return "Admin Panel";
}

function getInitials(name, email) {
    const source = name || email || "A";
    const parts = source.trim().split(/\s+/);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

export default function Topbar({ user, onMenuClick }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const name = user?.name || "Admin";
    const email = user?.email || "";

    return (
        <header className="admin-topbar">
            <div className="admin-topbar-left">
                <button type="button" className="admin-menu-btn" onClick={onMenuClick} aria-label="Toggle sidebar" title="Toggle sidebar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="admin-page-title">{getTitle(pathname)}</h1>
            </div>

            <div className="admin-profile" ref={menuRef}>
                <button
                    type="button"
                    className={`admin-profile-btn${open ? " open" : ""}`}
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                >
                    <span className="admin-avatar">{getInitials(name, email)}</span>
                    <span className="admin-profile-meta">
                        <strong>{name}</strong>
                        <span>{email}</span>
                    </span>
                    <svg className="admin-profile-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                <div className={`admin-dropdown${open ? " open" : ""}`}>
                    <Link href={ROUTES.PROFILE} onClick={() => setOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 19.5c1.5-3.2 4-4.8 7-4.8s5.5 1.6 7 4.8" />
                        </svg>
                        Update Profile
                    </Link>

                    <AdminForm action={logoutAction}>
                        <button type="submit" className="danger">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
                                <path d="M15 12H4m0 0 3-3m-3 3 3 3" />
                            </svg>
                            Logout
                        </button>
                    </AdminForm>
                </div>
            </div>
        </header>
    );
}
