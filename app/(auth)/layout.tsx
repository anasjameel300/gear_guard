export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                {children}
            </div>
        </div>
    )
}
