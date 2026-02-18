"use server";

type AuthResponse = {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    success?: boolean;
};
// Server actions for login
export async function loginAction(formData: FormData): Promise<AuthResponse> {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        return { error: "Invalid credentials" };
    }

    const data = await res.json().catch(() => ({}));
    return { accessToken: data.accessToken, refreshToken: data.refreshToken };
}
// Server actions for registration

export async function registerAction(formData: FormData): Promise<AuthResponse> {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        return { error: "Email already in use" };
    }

    const data = await res.json().catch(() => ({}));
    return {
        success: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    };
}