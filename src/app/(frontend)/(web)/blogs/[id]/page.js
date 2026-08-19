import { notFound } from "next/navigation";
import BlogDetails from "@/components/web/BlogDetails";
import { getBlogAction } from "../actions";

export default async function BlogDetailsPage({ params }) {
    const { id } = await params;
    const result = await getBlogAction(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return <BlogDetails blog={result.data} />;
}
