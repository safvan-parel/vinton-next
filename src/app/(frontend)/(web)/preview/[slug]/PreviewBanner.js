import Link from "next/link";
import { pageEditPath } from "@/lib/admin-routes";

export default function PreviewBanner({ slug }) {
    return (
        <div className="alert alert-warning text-center mb-0 rounded-0">
            Draft preview — this is not the live page.{" "}
            <Link href={pageEditPath(slug)}>Back to editor</Link>
        </div>
    );
}
