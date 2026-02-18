"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    // Create query client instance
    const [queryClient] = useState(() => new QueryClient());

    return (
        <HeroUIProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </HeroUIProvider>
    );
}