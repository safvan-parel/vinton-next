import PageTable from "./PageTable";
import { pageService } from "@/services/pageService";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
    const pages = await pageService.list();

    return (
        <div className="admin-card">
            <div className="pages-head">
                <div>
                    <h1 className="mb-1">Pages</h1>
                    <p className="mb-0">Search, enable, and edit site pages. Header and footer stay in the layout.</p>
                </div>
                <span className="pages-count">{pages.length} page{pages.length === 1 ? "" : "s"}</span>
            </div>
            <PageTable pages={pages} />
        </div>
    );
}
