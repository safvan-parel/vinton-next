export default function AuthLayout({ children }) {
    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />

            <main className="container mt-4">
                {children}
            </main>
        </>
    );
}