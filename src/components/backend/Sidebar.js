"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminUi } from "@/components/backend/AdminUiContext";
import { ROUTES } from "@/lib/admin-routes";

const menus = [
    {
        href: ROUTES.BACKEND,
        label: "Dashboard",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
        ),
    },
    {
        href: ROUTES.SLIDER,
        label: "Slider",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M8 12h8M10 9l-3 3 3 3M14 9l3 3-3 3" />
            </svg>
        ),
    },
    {
        href: ROUTES.BLOGS,
        label: "Blogs",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
                <path d="M17 20h2a2 2 0 0 0 2-2V8" />
                <path d="M8 8h6M8 12h6M8 16h4" />
            </svg>
        ),
    },
    {
        href: ROUTES.PAGES,
        label: "Pages",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 3h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M15 3v5h5M9 13h6M9 17h4" />
            </svg>
        ),
    },
    {
        href: ROUTES.SETTINGS,
        label: "Settings",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M6.2 17.8l1.4-1.4M16.4 7.6l1.4-1.4" />
            </svg>
        ),
    },
];

function isActive(pathname, href) {
    if (href === ROUTES.BACKEND) {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ onNavigate }) {
    const pathname = usePathname();
    const { setCollapsed } = useAdminUi();

    return (
        <aside className="admin-sidebar">
            <Link href={ROUTES.BACKEND} className="admin-brand" onClick={onNavigate}>
                <span className="admin-brand-mark">VA</span>
                <span className="admin-brand-text">
                    <strong>VINTON</strong>
                    <span>Admin Panel</span>
                </span>
            </Link>

            <ul className="admin-nav">
                {menus.map((item) => (
                    <li key={item.href} className="admin-nav-item">
                        <Link
                            href={item.href}
                            className={`admin-nav-link${isActive(pathname, item.href) ? " active" : ""}`}
                            onClick={onNavigate}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="admin-sidebar-collapse"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15 6l-6 6 6 6" />
                    <path d="M9 6l-6 6 6 6" />
                </svg>
                Collapse
            </button>
        </aside>
    );
}
