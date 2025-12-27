import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Redirect to dashboard if already logged in
    const session = await auth();
    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                {children}
            </div>
        </div>
    )
}
