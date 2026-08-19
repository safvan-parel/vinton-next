import { notFound } from "next/navigation";
import BlogForm from "../../BlogForm";
import { updateBlogAction } from "../../actions";
import { blogService } from "@/services/blogService";

export default async function EditBlogPage({ params }) {
    const { id } = await params;
    const blogId = Number(id);

    if (!Number.isInteger(blogId) || blogId < 1) {
        notFound();
    }

    let blog;

    try {
        blog = await blogService.getById(blogId);
    } catch {
        notFound();
    }

    return <BlogForm action={updateBlogAction} blog={blog} />;
}
