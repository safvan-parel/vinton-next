"use client";

import { createContext, useContext } from "react";

export const AdminUiContext = createContext({
    collapsed: false,
    setCollapsed: () => {},
});

export function useAdminUi() {
    return useContext(AdminUiContext);
}
