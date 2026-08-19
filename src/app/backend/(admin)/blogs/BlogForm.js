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

export default function BlogForm({ action, blog = null }) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const isEdit = Boolean(blog);

    const title = state.values?.title ?? blog?.title ?? "";
    const desc1 = state.values?.desc1 ?? blog?.desc1 ?? "";
    const desc2 = state.values?.desc2 ?? blog?.desc2 ?? "";
    const active = state.values?.active ?? blog?.active ?? true;
    const gallery = blog?.images || [];

    return (
        <div className="admin-card" style={{ maxWidth: 720 }}>
            <h2>{isEdit ? "Edit Blog" : "Add Blog"}</h2>
            <p className="mb-4">{isEdit ? "Update blog details." : "Create a new blog post."}</p>

            <AdminAlert message={state.message} success={state.success} resetOn={pending} />

            <AdminForm action={formAction} encType="multipart/form-data">
                {isEdit && <input type="hidden" name="id" value={blog.id} />}

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
                    <label className="form-label">Primary image {isEdit ? "(optional)" : ""}</label>
                    <input
                        type="file"
                        name="primaryImage"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        required={!isEdit}
                        className={`form-control ${state.errors?.primaryImage ? "is-invalid" : ""}`}
                    />
                    {state.errors?.primaryImage && (
                        <div className="invalid-feedback d-block">{state.errors.primaryImage[0]}</div>
                    )}
                    {isEdit && blog.primaryImage && (
                        <div className="mt-2">
                            <img src={blog.primaryImage} alt={blog.title} className="admin-thumb admin-thumb-lg" />
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description 1</label>
                    <textarea
                        name="desc1"
                        rows="4"
                        defaultValue={desc1}
                        className={`form-control ${state.errors?.desc1 ? "is-invalid" : ""}`}
                    />
                    {state.errors?.desc1 && (
                        <div className="invalid-feedback">{state.errors.desc1[0]}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Images</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        className={`form-control ${state.errors?.images ? "is-invalid" : ""}`}
                    />
                    {state.errors?.images && (
                        <div className="invalid-feedback d-block">{state.errors.images[0]}</div>
                    )}
                    {isEdit && gallery.length > 0 && (
                        <div className="admin-gallery mt-3">
                            {gallery.map((image) => (
                                <div key={image} className="admin-gallery-item">
                                    <img src={image} alt="" className="admin-thumb" />
                                    <label>
                                        <input type="checkbox" name="removeImages" value={image} className="form-check-input me-1" />
                                        Remove
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description 2</label>
                    <textarea
                        name="desc2"
                        rows="4"
                        defaultValue={desc2}
                        className={`form-control ${state.errors?.desc2 ? "is-invalid" : ""}`}
                    />
                    {state.errors?.desc2 && (
                        <div className="invalid-feedback">{state.errors.desc2[0]}</div>
                    )}
                </div>

                <div className="mb-4 form-check">
                    <input
                        type="checkbox"
                        name="active"
                        id="blogActive"
                        className="form-check-input"
                        defaultChecked={active}
                    />
                    <label className="form-check-label" htmlFor="blogActive">
                        Active
                    </label>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" disabled={pending} className="btn btn-primary">
                        {pending ? "Saving..." : isEdit ? "Update Blog" : "Save Blog"}
                    </button>
                    <Link href={ROUTES.BLOGS} className="btn btn-outline-secondary">
                        Cancel
                    </Link>
                </div>
            </AdminForm>
        </div>
    );
}
