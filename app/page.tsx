"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen w-full">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 sm:p-6">
                <header className="flex flex-col gap-3">
                    <h1 className="text-3xl font-semibold sm:text-4xl">
                        Task Manager
                    </h1>
                    <p className="max-w-2xl text-sm text-foreground-500 sm:text-base">
                        A simple task management SaaS to create, track, and update
                        your tasks with priority and status.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button color="primary" onPress={() => router.push("/login")}>
                            Sign in
                        </Button>
                        <p className="text-xs text-foreground-500">
                            Sign in to view your dashboard and tasks.
                        </p>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1">
                            <h2 className="text-lg font-semibold">Organize</h2>
                            <p className="text-sm text-foreground-500">
                                Keep tasks in one place.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <p className="text-sm text-foreground-500">
                                Create tasks with a title and optional description.
                                Track their status as you work.
                            </p>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1">
                            <h2 className="text-lg font-semibold">Prioritize</h2>
                            <p className="text-sm text-foreground-500">
                                Focus on what matters.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <p className="text-sm text-foreground-500">
                                Assign priority and keep momentum with a clear view
                                of your work.
                            </p>
                        </CardBody>
                    </Card>
                </section>
            </div>
        </main>
    );
}