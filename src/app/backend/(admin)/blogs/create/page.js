import BlogForm from "../BlogForm";
import { createBlogAction } from "../actions";

export default function CreateBlogPage() {
    return <BlogForm action={createBlogAction} />;
}
