import Link from "next/link";
import { pageService } from "@/services/pageService";

export default async function Navbar() {
    let enabled = new Set(["solutions", "about"]);

    try {
        enabled = new Set((await pageService.listEnabled()).map((page) => page.slug));
    } catch {
        // Keep default links if CMS pages cannot be loaded.
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand">
                    Vinton
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#webNavbar"
                    aria-controls="webNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="webNavbar">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link href="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/#blogs" className="nav-link">
                                Blogs
                            </Link>
                        </li>
                        {enabled.has("solutions") ? (
                            <li className="nav-item">
                                <Link href="/solutions" className="nav-link">
                                    Solutions
                                </Link>
                            </li>
                        ) : null}
                        {enabled.has("about") ? (
                            <li className="nav-item">
                                <Link href="/about" className="nav-link">
                                    About
                                </Link>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
