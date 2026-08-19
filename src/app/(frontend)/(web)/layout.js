import Script from "next/script";
import Navbar from "@/components/web/Navbar";
import Footer from "@/components/web/Footer";

export default function WebLayout({ children }) {
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />

            <Navbar />

            <main>{children}</main>

            <Footer />

            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                strategy="afterInteractive"
            />
        </>
    );
}
