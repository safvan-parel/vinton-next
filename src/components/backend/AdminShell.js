"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/backend/Sidebar";
import Topbar from "@/components/backend/Topbar";
import { AdminUiContext } from "@/components/backend/AdminUiContext";
import "@/components/backend/admin.css";

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminShell({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsedState] = useState(false);

    useEffect(() => {
        setCollapsedState(window.localStorage.getItem(STORAGE_KEY) === "1");
    }, []);

    const setCollapsed = useCallback((value) => {
        setCollapsedState((current) => {
            const next = typeof value === "function" ? value(current) : value;
            window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
            return next;
        });
    }, []);

    function onMenuClick() {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
            setSidebarOpen((open) => !open);
            return;
        }

        setCollapsed((open) => !open);
        setSidebarOpen(false);
    }

    return (
        <AdminUiContext.Provider value={{ collapsed, setCollapsed }}>
            <div className={`admin-shell${sidebarOpen ? " sidebar-open" : ""}${collapsed ? " sidebar-collapsed" : ""}`}>
                <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
                <Sidebar onNavigate={() => setSidebarOpen(false)} />

                <div className="admin-body">
                    <Topbar user={user} onMenuClick={onMenuClick} />
                    <main className={`admin-content${collapsed ? " is-previewing" : ""}`}>{children}</main>
                </div>
            </div>
        </AdminUiContext.Provider>
    );
}
