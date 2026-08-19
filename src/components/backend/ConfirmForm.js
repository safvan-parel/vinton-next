"use client";

import AdminForm from "@/components/backend/AdminForm";

export default function ConfirmForm({ action, message, className, children }) {
    return (
        <AdminForm
            action={action}
            className={className}
            onSubmit={(event) => {
                if (!window.confirm(message)) {
                    event.preventDefault();
                }
            }}
        >
            {children}
        </AdminForm>
    );
}
