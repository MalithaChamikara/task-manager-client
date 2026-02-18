"use client";

import { loginAction } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { EnvelopeSimple, Eye, EyeSlash, Lock } from "@phosphor-icons/react";

export default function LoginPage() {
    const { setAccessToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = await loginAction(formData);

            if (result?.accessToken) {
                setAccessToken(result.accessToken);
                router.push("/dashboard");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-start gap-1">
                    <h1 className="text-xl font-semibold">Sign in</h1>
                    <p className="text-sm text-foreground-500">
                        Use your email and password to continue.
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
                                <EnvelopeSimple
                                    size={18}
                                    className="text-foreground-500"
                                />
                            }
                        />

                        <Input
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            label="Password"
                            placeholder="••••••••"
                            isRequired
                            autoComplete="current-password"
                            isDisabled={loading}
                            startContent={<Lock size={18} className="text-foreground-500" />}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible((v) => !v)}
                                    className="text-foreground-500"
                                    aria-label={
                                        isPasswordVisible ? "Hide password" : "Show password"
                                    }
                                >
                                    {isPasswordVisible ? (
                                        <EyeSlash size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            }
                        />

                        <Alert
                            color="danger"
                            title="Login failed"
                            description={error ?? undefined}
                            isVisible={Boolean(error)}
                        />

                        <Button color="primary" type="submit" isLoading={loading}>
                            Sign in
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
