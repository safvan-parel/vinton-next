"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import AdminForm from "@/components/backend/AdminForm";
import AdminAlert from "@/components/backend/AdminAlert";

const initialState = {
    success: false,
    message: "",
    values: {
        email: "",
        rememberMe: false,
    },
    errors: {},
};

export default function Login() {
    const [state, formAction, pending] = useActionState(loginAction, initialState);

    return (
        <div className="admin-login">
            <div className="admin-login-card">
                <div className="admin-login-head">
                    <span className="admin-login-mark">V</span>
                    <div className="admin-login-brand">
                        <strong>VINTON</strong>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <div className="admin-login-body">
                    <h1>Sign in</h1>
                    <p>Use your admin account to continue.</p>

                    <AdminAlert message={state.message} success={state.success} resetOn={pending} />

                    <AdminForm action={formAction}>
                        <label className="admin-login-label">
                            Email
                            <input
                                type="email"
                                name="email"
                                defaultValue={state.values?.email}
                                className={`admin-login-input${state.errors?.email ? " is-invalid" : ""}`}
                                autoComplete="email"
                                placeholder="you@vinton.com"
                            />
                            {state.errors?.email && (
                                <span className="admin-login-error">{state.errors.email[0]}</span>
                            )}
                        </label>

                        <label className="admin-login-label">
                            Password
                            <input
                                type="password"
                                name="password"
                                className={`admin-login-input${state.errors?.password ? " is-invalid" : ""}`}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                            {state.errors?.password && (
                                <span className="admin-login-error">{state.errors.password[0]}</span>
                            )}
                        </label>

                        <label className="admin-login-check">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                defaultChecked={state.values?.rememberMe}
                            />
                            Remember me
                        </label>

                        <button type="submit" disabled={pending} className="admin-login-btn">
                            {pending ? "Signing in..." : "Sign in"}
                        </button>
                    </AdminForm>
                </div>
            </div>
        </div>
    );
}
