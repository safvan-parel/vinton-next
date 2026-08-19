import AdminShell from "@/components/backend/AdminShell";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function BackendLayout({ children }) {
    const user = await getCurrentUser();

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />

            <AdminShell user={user}>
                {children}
            </AdminShell>
        </>
    );
}
