"use server";

export async function loginAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }
    );

    if (!res.ok) {
        return { error: "Invalid credentials" };
    }

    const data = await res.json();
    return { accessToken: data.accessToken };
}