import Link from "next/link";
import { ROUTES } from "@/lib/admin-routes";
import { prisma } from "@/lib/prisma";
import { blogSelect } from "@/repositories/blogRepository";
import BlogTable from "./BlogTable";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
    const blogs = await prisma.blog.findMany({
        select: blogSelect,
        orderBy: { id: "desc" },
    });

    return (
        <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                <div>
                    <h1 className="mb-1">Blogs</h1>
                    <p className="mb-0">Manage blog posts, images, and status.</p>
                </div>
                <Link href={ROUTES.BLOG_CREATE} className="btn btn-primary">
                    Add Blog
                </Link>
            </div>

            <BlogTable blogs={blogs} />
        </div>
    );
}
