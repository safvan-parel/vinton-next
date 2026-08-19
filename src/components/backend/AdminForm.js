"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useAdminLoader } from "@/components/backend/AdminLoaderProvider";

function FormPending() {
    const { pending } = useFormStatus();
    const { setFormPending } = useAdminLoader();

    useEffect(() => {
        if (!pending) {
            return undefined;
        }

        setFormPending(true);
        return () => setFormPending(false);
    }, [pending, setFormPending]);

    return null;
}

export default function AdminForm({ children, ...props }) {
    return (
        <form {...props}>
            <FormPending />
            {children}
        </form>
    );
}
