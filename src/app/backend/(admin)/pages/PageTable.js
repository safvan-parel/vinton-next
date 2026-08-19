"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pageEditPath } from "@/lib/admin-routes";
import { APP_TIMEZONE } from "@/lib/timezone";
import { togglePageActiveAction } from "./actions";
import AdminForm from "@/components/backend/AdminForm";

const PAGE_SIZE = 8;

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString("en-IN", {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function matchesFilter(page, filter) {
    if (filter === "live") {
        return page.status === "published" && page.active;
    }

    if (filter === "draft") {
        return page.status !== "published";
    }

    if (filter === "disabled") {
        return page.active === false;
    }

    return true;
}

export default function PageTable({ pages }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [pageIndex, setPageIndex] = useState(1);

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        return pages.filter((page) => {
            if (!matchesFilter(page, filter)) {
                return false;
            }

            if (!term) {
                return true;
            }

            return [page.title, page.slug, page.status, page.active ? "enabled" : "disabled"]
                .join(" ")
                .toLowerCase()
                .includes(term);
        });
    }, [pages, query, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(pageIndex, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visible = filtered.slice(start, start + PAGE_SIZE);

    function updateQuery(value) {
        setQuery(value);
        setPageIndex(1);
    }

    function updateFilter(value) {
        setFilter(value);
        setPageIndex(1);
    }

    if (!pages.length) {
        return <p className="mb-0">No CMS pages yet.</p>;
    }

    return (
        <div className="pages-board">
            <div className="pages-toolbar">
                <label className="pages-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3-3" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => updateQuery(event.target.value)}
                        placeholder="Search pages..."
                    />
                </label>
                <div className="pages-filters">
                    {[
                        ["all", "All"],
                        ["live", "Live"],
                        ["draft", "Draft"],
                        ["disabled", "Disabled"],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={filter === value ? "is-active" : ""}
                            onClick={() => updateFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-responsive">
                <table className="table align-middle admin-table pages-table">
                    <thead>
                        <tr>
                            <th>Page</th>
                            <th>Status</th>
                            <th>Enabled</th>
                            <th>Published</th>
                            <th>Updated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!visible.length ? (
                            <tr>
                                <td colSpan="5" className="pages-empty">
                                    No pages match this search.
                                </td>
                            </tr>
                        ) : (
                            visible.map((page) => (
                                <tr key={page.id}>
                                    <td>
                                        <div className="pages-identity">
                                            <span className="pages-mark">{page.title.slice(0, 1)}</span>
                                            <span>
                                                <strong>{page.title}</strong>
                                                <small>/{page.slug}</small>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`pages-chip${page.status === "published" ? " is-live" : ""}`}>
                                            {page.status === "published" ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td>
                                        <AdminForm action={togglePageActiveAction} className="admin-toggle-form">
                                            <input type="hidden" name="slug" value={page.slug} />
                                            <button
                                                type="submit"
                                                className={`admin-toggle${page.active ? " is-on" : ""}`}
                                                title={page.active ? "Disable page" : "Enable page"}
                                                aria-pressed={page.active}
                                            >
                                                <span className="admin-toggle-track">
                                                    <span className="admin-toggle-knob" />
                                                </span>
                                            </button>
                                        </AdminForm>
                                    </td>
                                    <td className="text-nowrap pages-date">{formatDate(page.publishedAt)}</td>
                                    <td className="text-nowrap pages-date">{formatDate(page.updatedAt)}</td>
                                    <td className="text-end">
                                        <Link href={pageEditPath(page.slug)} className="pages-edit">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pages-pager">
                <span>
                    {filtered.length ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)}` : "0"} of {filtered.length}
                </span>
                <div>
                    <button type="button" disabled={currentPage <= 1} onClick={() => setPageIndex(currentPage - 1)}>
                        Prev
                    </button>
                    <strong>
                        {currentPage} / {totalPages}
                    </strong>
                    <button type="button" disabled={currentPage >= totalPages} onClick={() => setPageIndex(currentPage + 1)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
