"use client";

import { createContext, useContext, useState } from "react";

// Define the shape of  authentication context
interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the authentication context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}