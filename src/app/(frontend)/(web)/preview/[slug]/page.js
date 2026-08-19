import { notFound, redirect } from "next/navigation";
import { getPageTemplate, getPageType } from "@/cms/registry";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROUTES } from "@/lib/admin-routes";
import { pageService } from "@/services/pageService";
import PreviewBanner from "./PreviewBanner";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params, searchParams }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect(ROUTES.LOGIN);
    }

    const { slug } = await params;
    const query = await searchParams;
    const embed = query.embed === "1";

    if (!getPageType(slug)) {
        notFound();
    }

    let page;

    try {
        page = await pageService.getDraft(slug);
    } catch {
        notFound();
    }

    const Template = getPageTemplate(page.type);

    if (!Template) {
        notFound();
    }

    return (
        <>
            {!embed && <PreviewBanner slug={page.slug} />}
            <Template content={page.draftContent} />
        </>
    );
}
