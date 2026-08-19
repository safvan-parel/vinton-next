import { notFound } from "next/navigation";
import { getPageType } from "@/cms/registry";
import { pageService } from "@/services/pageService";
import PageForm from "../../PageForm";

export const dynamic = "force-dynamic";

const notices = {
    published: "Page published",
    unpublished: "Page unpublished",
};

export default async function EditPagePage({ params, searchParams }) {
    const { slug } = await params;
    const query = await searchParams;
    let page;

    try {
        page = await pageService.getBySlug(slug);
    } catch {
        notFound();
    }

    const pageType = getPageType(page.type);

    if (!pageType) {
        notFound();
    }

    return <PageForm page={page} pageType={pageType} notice={notices[query.status] || ""} />;
}
