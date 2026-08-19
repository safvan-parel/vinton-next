"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "@/components/backend/admin.css";

const AdminLoaderContext = createContext({
    setFormPending: () => {},
});

export function useAdminLoader() {
    return useContext(AdminLoaderContext);
}

export default function AdminLoaderProvider({ children }) {
    const pathname = usePathname();
    const [navPending, setNavPending] = useState(false);
    const [formCount, setFormCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const busy = navPending || formCount > 0;

    const setFormPending = useCallback((pending) => {
        setFormCount((count) => (pending ? count + 1 : Math.max(0, count - 1)));
    }, []);

    useEffect(() => {
        setNavPending(false);
    }, [pathname]);

    useEffect(() => {
        if (!busy) {
            setVisible(false);
            return undefined;
        }

        const show = setTimeout(() => setVisible(true), 80);
        const hide = setTimeout(() => setNavPending(false), 12000);

        return () => {
            clearTimeout(show);
            clearTimeout(hide);
        };
    }, [busy]);

    useEffect(() => {
        function onClick(event) {
            if (event.defaultPrevented || event.button !== 0) {
                return;
            }

            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const link = event.target.closest("a[href]");

            if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) {
                return;
            }

            let url;

            try {
                url = new URL(link.href, window.location.href);
            } catch {
                return;
            }

            if (url.origin !== window.location.origin || !url.pathname.startsWith("/backend")) {
                return;
            }

            if (url.pathname === window.location.pathname && url.search === window.location.search) {
                return;
            }

            setNavPending(true);
        }

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    return (
        <AdminLoaderContext.Provider value={{ setFormPending }}>
            {children}

            {visible ? (
                <div className="admin-loader" role="alert" aria-live="assertive" aria-busy="true">
                    <div className="admin-loader-card">
                        <span className="admin-spinner" />
                        <strong>Please wait</strong>
                        <span>Loading…</span>
                    </div>
                </div>
            ) : null}
        </AdminLoaderContext.Provider>
    );
}
