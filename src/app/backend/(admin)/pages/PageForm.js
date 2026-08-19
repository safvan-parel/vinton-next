"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ConfirmForm from "@/components/backend/ConfirmForm";
import AdminForm from "@/components/backend/AdminForm";
import AdminAlert from "@/components/backend/AdminAlert";
import { useAdminUi } from "@/components/backend/AdminUiContext";
import { ROUTES } from "@/lib/admin-routes";
import { previewPath } from "@/lib/web-routes";
import { publishPageAction, savePageDraftAction, unpublishPageAction } from "./actions";

const initialState = {
    success: false,
    message: "",
    data: null,
    errors: {},
};

function newKey() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyItem(fields) {
    const item = { _key: newKey() };

    for (const field of fields) {
        if (field.type === "list") {
            item[field.name] = [];
        } else if (field.type === "number") {
            item[field.name] = 0;
        } else {
            item[field.name] = "";
        }
    }

    return item;
}

function withKeys(value) {
    if (Array.isArray(value)) {
        return value.map((item) => {
            const next = withKeys(item);

            if (next && typeof next === "object" && !Array.isArray(next)) {
                return { ...next, _key: next._key || newKey() };
            }

            return next;
        });
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, withKeys(nested)]));
    }

    return value;
}

function stripKeys(value) {
    if (Array.isArray(value)) {
        return value.map(stripKeys);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([key]) => key !== "_key")
                .map(([key, nested]) => [key, stripKeys(nested)]),
        );
    }

    return value;
}

function mergeDefaults(defaults, current) {
    if (Array.isArray(defaults)) {
        return Array.isArray(current) ? current : defaults;
    }

    if (defaults && typeof defaults === "object") {
        const source = current && typeof current === "object" && !Array.isArray(current) ? current : {};
        const merged = {};

        for (const key of Object.keys(defaults)) {
            merged[key] = mergeDefaults(defaults[key], source[key]);
        }

        for (const key of Object.keys(source)) {
            if (!(key in merged)) {
                merged[key] = source[key];
            }
        }

        return merged;
    }

    return current === undefined ? defaults : current;
}

function setValue(source, path, value) {
    if (!path.length) {
        return value;
    }

    const [head, ...rest] = path;
    const clone = Array.isArray(source) ? [...source] : { ...source };
    clone[head] = setValue(clone[head] ?? (typeof rest[0] === "number" ? [] : {}), rest, value);
    return clone;
}

function itemTitle(item, field, index) {
    return item.year || item.title || item.name || item.heading || item.label || `${field.itemLabel} ${index + 1}`;
}

function sectionSummary(section, content) {
    const listField = section.fields.find((field) => field.type === "list");

    if (!listField) {
        return "Text";
    }

    const items = content?.[section.id]?.[listField.name];
    const count = Array.isArray(items) ? items.length : 0;
    const label = (listField.itemLabel || "item").toLowerCase();

    return `${count} ${label}${count === 1 ? "" : "s"}`;
}

function FieldList({ fields, value, path, onChange, filePrefix, nested = false }) {
    const groups = [];
    let buffer = [];

    function flush() {
        if (!buffer.length) {
            return;
        }

        groups.push({ kind: "grid", fields: buffer });
        buffer = [];
    }

    fields.forEach((field) => {
        if (field.type === "list") {
            flush();
            groups.push({ kind: "list", field });
            return;
        }

        buffer.push(field);
    });

    flush();

    return (
        <>
            {groups.map((group, groupIndex) => {
                if (group.kind === "list") {
                    return (
                        <Field
                            key={group.field.name}
                            field={group.field}
                            value={value?.[group.field.name]}
                            path={[...path, group.field.name]}
                            onChange={onChange}
                            filePrefix={filePrefix}
                            nested={nested}
                        />
                    );
                }

                return (
                    <div key={`grid-${groupIndex}`} className={`page-field-grid${nested ? " is-nested" : ""}`}>
                        {group.fields.map((field) => (
                            <Field
                                key={field.name}
                                field={field}
                                value={value?.[field.name]}
                                path={[...path, field.name]}
                                onChange={onChange}
                                filePrefix={filePrefix}
                                nested={nested}
                            />
                        ))}
                    </div>
                );
            })}
        </>
    );
}

function Field({ field, value, path, onChange, filePrefix, nested = false }) {
    const fileName = `${filePrefix}${path.join(".")}`;
    const wide = field.type === "textarea" || field.type === "image" || field.type === "list";

    if (field.type === "textarea") {
        return (
            <div className={`page-field${wide ? " is-wide" : ""}`}>
                <label className="page-field-label">{field.label}</label>
                <textarea
                    className="form-control"
                    rows={nested ? 2 : 4}
                    value={value || ""}
                    onChange={(event) => onChange(path, event.target.value)}
                />
            </div>
        );
    }

    if (field.type === "number") {
        return (
            <div className="page-field">
                <label className="page-field-label">{field.label}</label>
                <input
                    type="number"
                    className="form-control"
                    value={value ?? 0}
                    onChange={(event) => onChange(path, event.target.value === "" ? 0 : Number(event.target.value))}
                />
            </div>
        );
    }

    if (field.type === "image") {
        return (
            <div className={`page-field is-wide${nested ? " is-image-sm" : ""}`}>
                <label className="page-field-label">{field.label}</label>
                <label className={`page-image-tile${value ? "" : " is-empty"}`}>
                    {value ? <img src={value} alt="" /> : <span>Click to add {field.label.toLowerCase()}</span>}
                    <input type="file" name={fileName} accept="image/jpeg,image/png,image/webp,image/gif" />
                </label>
            </div>
        );
    }

    if (field.type === "list") {
        const items = Array.isArray(value) ? value : [];

        return (
            <div className={`page-list${nested ? " is-nested" : ""}`}>
                <div className="page-list-head">
                    <span>
                        {field.label}
                        <small>{items.length}</small>
                    </span>
                    <button
                        type="button"
                        className="page-add-btn"
                        onClick={() => onChange(path, [...items, emptyItem(field.fields)])}
                    >
                        + Add {field.itemLabel}
                    </button>
                </div>
                {!items.length ? (
                    <button
                        type="button"
                        className="page-list-empty"
                        onClick={() => onChange(path, [...items, emptyItem(field.fields)])}
                    >
                        No {field.itemLabel.toLowerCase()}s yet. Click to add one.
                    </button>
                ) : (
                    <div className="page-block-stack">
                        {items.map((item, index) => (
                            <article key={item._key || index} className="page-block-card">
                                <div className="page-block-card-head">
                                    <span className="page-block-index">{index + 1}</span>
                                    <strong>{itemTitle(item, field, index)}</strong>
                                    <button
                                        type="button"
                                        className="page-remove-btn"
                                        onClick={() => onChange(path, items.filter((_, itemIndex) => itemIndex !== index))}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <FieldList
                                    fields={field.fields}
                                    value={item}
                                    path={[...path, index]}
                                    onChange={onChange}
                                    filePrefix={filePrefix}
                                    nested
                                />
                            </article>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="page-field">
            <label className="page-field-label">{field.label}</label>
            <input
                type="text"
                className="form-control"
                value={value || ""}
                onChange={(event) => onChange(path, event.target.value)}
            />
        </div>
    );
}

export default function PageForm({ page, pageType, notice }) {
    const { collapsed, setCollapsed } = useAdminUi();
    const collapsedBeforePreview = useRef(collapsed);
    const forcedCollapse = useRef(false);
    const [state, formAction, pending] = useActionState(savePageDraftAction, initialState);
    const [flash, setFlash] = useState(notice || "");
    const [sectionId, setSectionId] = useState(pageType.sections[0]?.id);
    const [content, setContent] = useState(() => withKeys(mergeDefaults(pageType.defaults, page.draftContent || {})));
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const section = pageType.sections.find((item) => item.id === sectionId) || pageType.sections[0];
    const published = page.status === "published";
    const formId = "page-draft-form";

    const payload = useMemo(() => JSON.stringify(stripKeys(content)), [content]);

    useEffect(() => {
        if (!notice) {
            return;
        }

        const url = new URL(window.location.href);

        if (url.searchParams.has("status")) {
            url.searchParams.delete("status");
            const query = url.searchParams.toString();
            window.history.replaceState(null, "", `${url.pathname}${query ? `?${query}` : ""}`);
        }
    }, [notice]);

    useEffect(() => {
        if (state.success && state.data?.draftContent) {
            setContent(withKeys(state.data.draftContent));
            setIframeKey((value) => value + 1);
        }
    }, [state]);

    useEffect(() => {
        return () => {
            if (forcedCollapse.current) {
                setCollapsed(collapsedBeforePreview.current);
            }
        };
    }, [setCollapsed]);

    useEffect(() => {
        if (!fullscreen) {
            return undefined;
        }

        function onKey(event) {
            if (event.key === "Escape") {
                setFullscreen(false);
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [fullscreen]);

    function onChange(path, value) {
        setContent((current) => setValue(current, path, value));
    }

    function openPreview() {
        if (!forcedCollapse.current) {
            collapsedBeforePreview.current = collapsed;
            forcedCollapse.current = true;
        }

        setPreviewOpen(true);
        setCollapsed(true);
        setIframeKey((value) => value + 1);
    }

    function closePreview() {
        setPreviewOpen(false);
        setFullscreen(false);

        if (forcedCollapse.current) {
            setCollapsed(collapsedBeforePreview.current);
            forcedCollapse.current = false;
        }
    }

    return (
        <div className={`page-editor${previewOpen ? " is-previewing" : ""}`}>
            <div className="page-editor-form">
                <header className="page-toolbar">
                    <div className="page-toolbar-meta">
                        <Link href={ROUTES.PAGES} className="page-toolbar-back" aria-label="Back to pages">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </Link>
                        <div className="page-toolbar-identity">
                            <h1>{page.title}</h1>
                            <span className="page-toolbar-url">
                                <span className="page-toolbar-url-dot" />
                                /{page.slug}
                            </span>
                        </div>
                        <span className={`page-toolbar-status${published ? " is-live" : ""}`}>
                            <span />
                            {published ? "Live" : "Draft"}
                        </span>
                    </div>
                    <div className="page-toolbar-flow" aria-label="Publish flow">
                        <button form={formId} type="submit" className="page-flow-btn is-save" disabled={pending}>
                            <small>01</small>
                            {pending ? "Saving" : "Save"}
                        </button>
                        <span className="page-flow-line" />
                        <button type="button" className="page-flow-btn is-preview" onClick={openPreview}>
                            <small>02</small>
                            Preview
                        </button>
                        <span className="page-flow-line" />
                        <ConfirmForm action={publishPageAction} message="Publish this draft to the live page?" className="page-flow-form">
                            <input type="hidden" name="slug" value={page.slug} />
                            <button type="submit" className="page-flow-btn is-publish">
                                <small>03</small>
                                Publish
                            </button>
                        </ConfirmForm>
                        {published ? (
                            <ConfirmForm action={unpublishPageAction} message="Unpublish this page from the live site?" className="page-flow-form">
                                <input type="hidden" name="slug" value={page.slug} />
                                <button type="submit" className="page-flow-btn is-unpublish">
                                    Unpublish
                                </button>
                            </ConfirmForm>
                        ) : null}
                        {published ? (
                            <Link href={`/${page.slug}`} target="_blank" className="page-flow-btn is-live">
                                View
                            </Link>
                        ) : null}
                    </div>
                </header>

                <AdminAlert
                    message={state.message || flash}
                    success={Boolean(state.success || flash)}
                    resetOn={pending}
                    onClose={() => setFlash("")}
                />

                <div className="page-studio">
                    <nav className="page-outline" aria-label="Page sections">
                        <p className="page-outline-title">On this page</p>
                        {pageType.sections.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`page-outline-item${item.id === section.id ? " is-active" : ""}`}
                                onClick={() => setSectionId(item.id)}
                            >
                                <span className="page-outline-index">{String(index + 1).padStart(2, "0")}</span>
                                <span>
                                    <strong>{item.label}</strong>
                                    <small>{sectionSummary(item, content)}</small>
                                </span>
                            </button>
                        ))}
                    </nav>

                    <AdminForm id={formId} action={formAction} encType="multipart/form-data" className="page-canvas">
                        <input type="hidden" name="slug" value={page.slug} />
                        <input type="hidden" name="content" value={payload} />

                        {pageType.sections.map((item) => (
                            <div key={item.id} className={item.id === section.id ? "" : "d-none"}>
                                <div className="page-canvas-head">
                                    <span>Section</span>
                                    <h2>{item.label}</h2>
                                    {item.hint ? <p>{item.hint}</p> : null}
                                </div>
                                <FieldList
                                    fields={item.fields}
                                    value={content[item.id]}
                                    path={[item.id]}
                                    onChange={onChange}
                                    filePrefix="image:"
                                />
                            </div>
                        ))}
                    </AdminForm>
                </div>
            </div>

            {previewOpen ? (
                <aside className={`page-preview${fullscreen ? " is-fullscreen" : ""}`}>
                    <div className="page-preview-bar">
                        <span className="page-preview-label">Draft preview</span>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIframeKey((value) => value + 1)}>
                            Refresh
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setFullscreen((value) => !value)}
                        >
                            {fullscreen ? "Exit full screen" : "Full screen"}
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={closePreview}>
                            Close
                        </button>
                    </div>
                    <iframe
                        key={iframeKey}
                        title={`${page.title} preview`}
                        src={previewPath(page.slug, true)}
                    />
                </aside>
            ) : null}
        </div>
    );
}
