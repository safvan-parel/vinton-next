import { notFound } from "next/navigation";
import { getPageTemplate, getPageType } from "@/cms/registry";
import { pageService } from "@/services/pageService";

export const dynamic = "force-dynamic";

export default async function CmsPage({ params }) {
    const { slug } = await params;

    if (!getPageType(slug)) {
        notFound();
    }

    let publicPage;

    try {
        publicPage = await pageService.getPublic(slug);
    } catch {
        notFound();
    }

    const Template = getPageTemplate(publicPage.type);

    if (!Template) {
        notFound();
    }

    return <Template content={publicPage.content} />;
}
