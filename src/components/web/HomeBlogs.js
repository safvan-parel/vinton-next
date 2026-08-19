import Link from "next/link";
import { blogPath } from "@/lib/web-routes";

function excerpt(text) {
    if (!text) {
        return "";
    }

    return text.length > 140 ? `${text.slice(0, 140).trim()}…` : text;
}

export default function HomeBlogs({ blogs }) {
    return (
        <section id="blogs" className="container py-5">
            <h2 className="mb-4">Blogs</h2>

            {!blogs.length ? (
                <p className="text-muted mb-0">No blogs yet.</p>
            ) : (
                <div className="row g-4">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="col-md-4">
                            <article className="card h-100">
                                {blog.primaryImage ? (
                                    <img
                                        src={blog.primaryImage}
                                        alt={blog.title}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                ) : null}
                                <div className="card-body">
                                    <h3 className="card-title h5">{blog.title}</h3>
                                    {blog.desc1 ? (
                                        <p className="card-text">{excerpt(blog.desc1)}</p>
                                    ) : null}
                                    <Link href={blogPath(blog.id)} className="stretched-link">
                                        Read more
                                    </Link>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
