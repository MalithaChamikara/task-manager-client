"use client";

import { registerAction } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { EnvelopeSimple, Lock } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const { setAccessToken } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const password = String(formData.get("password") || "");
        const confirmPassword = String(formData.get("confirmPassword") || "");

        if (password !== confirmPassword) {
            setLoading(false);
            setError("Passwords do not match.");
            return;
        }

        try {
            const result = await registerAction(formData);

            if (result?.accessToken) {
                // Backend returns accessToken/refreshToken on register
                setAccessToken(result.accessToken);
                router.push("/dashboard");
                return;
            }

            if (result?.success) {
                router.push("/login");
                return;
            }

            setError(result?.error ?? "Registration failed");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-start gap-1">
                    <h1 className="text-xl font-semibold">Create account</h1>
                    <p className="text-sm text-foreground-500">
                        Create your own account to get started.
                    </p>
                </CardHeader>

                <CardBody>
                    <form action={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            isRequired
                            autoComplete="email"
                            isDisabled={loading}
                            startContent={
                                <EnvelopeSimple size={18} className="text-foreground-500" />
                            }
                        />

                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            isRequired
                            autoComplete="new-password"
                            isDisabled={loading}
                            startContent={<Lock size={18} className="text-foreground-500" />}
                        />

                        <Input
                            name="confirmPassword"
                            type="password"
                            label="Confirm password"
                            placeholder="••••••••"
                            isRequired
                            autoComplete="new-password"
                            isDisabled={loading}
                            startContent={<Lock size={18} className="text-foreground-500" />}
                        />

                        <Alert
                            color="danger"
                            title="Registration failed"
                            description={error ?? undefined}
                            isVisible={Boolean(error)}
                        />

                        <Button color="primary" type="submit" isLoading={loading}>
                            Create account
                        </Button>

                        <p className="text-sm text-foreground-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}