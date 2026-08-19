"use client";

import { useActionState } from "react";
import { updateProfileAction } from "./actions";
import AdminForm from "@/components/backend/AdminForm";
import AdminAlert from "@/components/backend/AdminAlert";

const initialState = {
    success: false,
    message: "",
    values: null,
    errors: {},
};

export default function ProfileForm({ user }) {
    const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

    const name = state.values?.name ?? user?.name ?? "";
    const email = state.values?.email ?? user?.email ?? "";

    return (
        <div className="admin-card" style={{ maxWidth: 560 }}>
            <h2>Update Profile</h2>
            <p className="mb-4">Change your name, email, or password.</p>

            <AdminAlert message={state.message} success={state.success} resetOn={pending} />

            <AdminForm action={formAction} key={`${user?.name}-${user?.email}`}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={name}
                        className={`form-control ${state.errors?.name ? "is-invalid" : ""}`}
                    />
                    {state.errors?.name && (
                        <div className="invalid-feedback">{state.errors.name[0]}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={email}
                        className={`form-control ${state.errors?.email ? "is-invalid" : ""}`}
                        autoComplete="email"
                    />
                    {state.errors?.email && (
                        <div className="invalid-feedback">{state.errors.email[0]}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="form-label">New password</label>
                    <input
                        type="password"
                        name="password"
                        className={`form-control ${state.errors?.password ? "is-invalid" : ""}`}
                        autoComplete="new-password"
                        placeholder="Leave blank to keep current password"
                    />
                    {state.errors?.password && (
                        <div className="invalid-feedback">{state.errors.password[0]}</div>
                    )}
                </div>

                <button type="submit" disabled={pending} className="btn btn-primary">
                    {pending ? "Saving..." : "Save changes"}
                </button>
            </AdminForm>
        </div>
    );
}
