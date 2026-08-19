import Link from "next/link";
import { ROUTES, blogEditPath } from "@/lib/admin-routes";
import { APP_TIMEZONE } from "@/lib/timezone";
import ConfirmForm from "@/components/backend/ConfirmForm";
import AdminForm from "@/components/backend/AdminForm";
import { changeBlogStatusAction, deleteBlogAction } from "./actions";

function formatDate(value) {
    return new Date(value).toLocaleString("en-IN", {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function createdByName(blog) {
    return blog.createdBy?.name || blog.createdBy?.email || "—";
}

export default function BlogTable({ blogs }) {
    if (!blogs.length) {
        return (
            <p className="mb-0">
                No blogs yet.{" "}
                <Link href={ROUTES.BLOG_CREATE}>Add the first blog</Link>.
            </p>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created by</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>
                                {blog.primaryImage ? (
                                    <img src={blog.primaryImage} alt={blog.title} className="admin-thumb" />
                                ) : (
                                    <span className="text-muted">No image</span>
                                )}
                            </td>
                            <td>{blog.title}</td>
                            <td className="admin-desc">{blog.desc1}</td>
                            <td>
                                <span className={`badge ${blog.active ? "bg-success" : "bg-secondary"}`}>
                                    {blog.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>{createdByName(blog)}</td>
                            <td className="text-nowrap">{formatDate(blog.createdAt)}</td>
                            <td>
                                <div className="admin-actions">
                                    <Link href={blogEditPath(blog.id)} className="btn btn-sm btn-outline-primary">
                                        Edit
                                    </Link>

                                    <AdminForm action={changeBlogStatusAction}>
                                        <input type="hidden" name="id" value={blog.id} />
                                        <button type="submit" className="btn btn-sm btn-outline-secondary">
                                            {blog.active ? "Deactivate" : "Activate"}
                                        </button>
                                    </AdminForm>

                                    <ConfirmForm action={deleteBlogAction} message="Delete this blog?">
                                        <input type="hidden" name="id" value={blog.id} />
                                        <button type="submit" className="btn btn-sm btn-outline-danger">
                                            Delete
                                        </button>
                                    </ConfirmForm>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
