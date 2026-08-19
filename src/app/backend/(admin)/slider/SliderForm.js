"use client";

import { useActionState } from "react";
import Link from "next/link";
import AdminForm from "@/components/backend/AdminForm";
import AdminAlert from "@/components/backend/AdminAlert";
import { ROUTES } from "@/lib/admin-routes";

const initialState = {
    success: false,
    message: "",
    values: null,
    errors: {},
};

export default function SliderForm({ action, slider = null }) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const isEdit = Boolean(slider);

    const title = state.values?.title ?? slider?.title ?? "";
    const desc = state.values?.desc ?? slider?.desc ?? "";
    const active = state.values?.active ?? slider?.active ?? true;

    return (
        <div className="admin-card" style={{ maxWidth: 640 }}>
            <h2>{isEdit ? "Edit Slider" : "Add Slider"}</h2>
            <p className="mb-4">{isEdit ? "Update slider details." : "Create a new homepage slider."}</p>

            <AdminAlert message={state.message} success={state.success} resetOn={pending} />

            <AdminForm action={formAction} encType="multipart/form-data">
                {isEdit && <input type="hidden" name="id" value={slider.id} />}

                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={title}
                        className={`form-control ${state.errors?.title ? "is-invalid" : ""}`}
                    />
                    {state.errors?.title && (
                        <div className="invalid-feedback">{state.errors.title[0]}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Image {isEdit ? "(optional)" : ""}</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        required={!isEdit}
                        className={`form-control ${state.errors?.image ? "is-invalid" : ""}`}
                    />
                    {state.errors?.image && (
                        <div className="invalid-feedback d-block">{state.errors.image[0]}</div>
                    )}
                    {isEdit && slider.image && (
                        <div className="mt-2">
                            <img src={slider.image} alt={slider.title} className="admin-thumb admin-thumb-lg" />
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        name="desc"
                        rows="4"
                        defaultValue={desc}
                        className={`form-control ${state.errors?.desc ? "is-invalid" : ""}`}
                    />
                    {state.errors?.desc && (
                        <div className="invalid-feedback">{state.errors.desc[0]}</div>
                    )}
                </div>

                <div className="mb-4 form-check">
                    <input
                        type="checkbox"
                        name="active"
                        id="sliderActive"
                        className="form-check-input"
                        defaultChecked={active}
                    />
                    <label className="form-check-label" htmlFor="sliderActive">
                        Active
                    </label>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" disabled={pending} className="btn btn-primary">
                        {pending ? "Saving..." : isEdit ? "Update Slider" : "Save Slider"}
                    </button>
                    <Link href={ROUTES.SLIDER} className="btn btn-outline-secondary">
                        Cancel
                    </Link>
                </div>
            </AdminForm>
        </div>
    );
}
