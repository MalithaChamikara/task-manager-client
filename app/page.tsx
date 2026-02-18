"use client";

import { Button, Card, CardBody, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen w-full">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 p-4 sm:p-6 lg:grid-cols-2 lg:items-center">
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold sm:text-4xl">Task Manager</h1>
                        <p className="max-w-2xl text-sm text-foreground-500 sm:text-base">
                            Create, prioritize, and track tasks with status and priority—fast.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button color="primary" onPress={() => router.push("/login")}>Sign in</Button>
                        <Button variant="flat" onPress={() => router.push("/register")}>Create account</Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-col items-start gap-1">
                                <h2 className="text-lg font-semibold">Organize</h2>
                                <p className="text-sm text-foreground-500">Everything in one place.</p>
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                                    Create tasks with titles and descriptions, then update as you go.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-col items-start gap-1">
                                <h2 className="text-lg font-semibold">Prioritize</h2>
                                <p className="text-sm text-foreground-500">Focus on what matters.</p>
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                                    Use priority and status to keep your work clear.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </section>

                <section className="order-first lg:order-last">
                    <Card>
                        <CardBody>
                            <Image
                                src="/hero-illustration.svg"
                                alt="Task Manager preview"
                                radius="lg"
                                className="w-full"
                            />
                        </CardBody>
                    </Card>
                </section>
            </div>
        </main>
    );
}