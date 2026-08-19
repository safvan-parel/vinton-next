import Link from "next/link";
import { ROUTES } from "@/lib/web-routes";
import { APP_TIMEZONE } from "@/lib/timezone";

function formatDate(value) {
    return new Date(value).toLocaleString("en-IN", {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function BlogDetails({ blog }) {
    const gallery = blog.images || [];
    const author = blog.createdBy?.name || blog.createdBy?.email;

    return (
        <article className="container py-5">
            <Link href={ROUTES.BLOGS} className="d-inline-block mb-3">
                Back to blogs
            </Link>

            <h1 className="mb-2">{blog.title}</h1>
            <p className="text-muted mb-4">
                {author ? `${author} · ` : ""}
                {formatDate(blog.createdAt)}
            </p>

            {blog.primaryImage ? (
                <img
                    src={blog.primaryImage}
                    alt={blog.title}
                    className="img-fluid rounded mb-4 w-100"
                    style={{ maxHeight: "420px", objectFit: "cover" }}
                />
            ) : null}

            {blog.desc1 ? (
                <p className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
                    {blog.desc1}
                </p>
            ) : null}

            {gallery.length > 0 ? (
                <div className="row g-3 mb-4">
                    {gallery.map((image) => (
                        <div key={image} className="col-md-4">
                            <img
                                src={image}
                                alt=""
                                className="img-fluid rounded w-100"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </div>
            ) : null}

            {blog.desc2 ? (
                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {blog.desc2}
                </p>
            ) : null}
        </article>
    );
}
