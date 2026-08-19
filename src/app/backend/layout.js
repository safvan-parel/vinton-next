import AdminLoaderProvider from "@/components/backend/AdminLoaderProvider";

export default function BackendLayout({ children }) {
    return <AdminLoaderProvider>{children}</AdminLoaderProvider>;
}
