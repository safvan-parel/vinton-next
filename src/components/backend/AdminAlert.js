"use client";

import { useEffect, useState } from "react";

export default function AdminAlert({ message, success = false, resetOn = false, onClose }) {
    const [open, setOpen] = useState(Boolean(message));

    useEffect(() => {
        if (message && !resetOn) {
            setOpen(true);
        }
    }, [message, success, resetOn]);

    function close() {
        setOpen(false);
        onClose?.();
    }

    if (!message || !open) {
        return null;
    }

    return (
        <div className={`admin-alert${success ? " is-ok" : " is-err"}`} role="alert">
            <span className="admin-alert-mark" aria-hidden="true">
                {success ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12.5l4.2 4.2L19 7.5" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 8v5M12 16.5h.01" />
                    </svg>
                )}
            </span>

            <p>{message}</p>

            <button type="button" className="admin-alert-close" onClick={close} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>
        </div>
    );
}
