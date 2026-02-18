"use client";

import { getTasksAction, type Task } from "@/actions/tasks";
import { AddTaskForm } from "@/components/AddTaskForm";
import { EditTaskForm } from "@/components/EditTaskForm";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Skeleton,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function statusChipColor(status: Task["status"]) {
    if (status === "done") return "success";
    if (status === "in-progress") return "primary";
    return "default";
}

function priorityChipColor(priority: Task["priority"]) {
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "success";
}

export default function DashboardPage() {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const tasksQuery = useQuery({
        queryKey: ["tasks"],
        enabled: Boolean(accessToken),
        queryFn: async (): Promise<Task[]> => {
            const result = await getTasksAction(accessToken!, {});
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
    });

    const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);

    if (!accessToken) {
        return (
            <div className="min-h-screen w-full p-4 sm:p-6">
                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                            <p className="text-sm text-foreground-500">
                                You need to sign in to view tasks.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <Button color="primary" onPress={() => router.push("/login")}>Go to login</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                        <p className="text-sm text-foreground-500">All your tasks.</p>
                    </div>

                    <Button color="primary" onPress={() => setIsAddOpen(true)}>Create new task</Button>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-col items-start gap-1">
                            <h2 className="text-lg font-semibold">Tasks</h2>
                            <p className="text-sm text-foreground-500">Click a task to edit.</p>
                        </CardHeader>
                        <CardBody className="gap-4">
                            <Alert
                                color="danger"
                                title="Couldn’t load tasks"
                                description={tasksQuery.error instanceof Error ? tasksQuery.error.message : undefined}
                                isVisible={Boolean(tasksQuery.error)}
                            />

                            {tasksQuery.isLoading ? (
                                <div className="flex flex-col gap-3">
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <Card key={idx}>
                                            <CardBody className="gap-2">
                                                <Skeleton className="h-4 w-2/3 rounded-md" />
                                                <Skeleton className="h-3 w-full rounded-md" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-6 w-20 rounded-full" />
                                                    <Skeleton className="h-6 w-20 rounded-full" />
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="flex flex-col items-start gap-3">
                                    <p className="text-sm text-foreground-500">No tasks yet.</p>
                                    <Button color="primary" variant="flat" onPress={() => setIsAddOpen(true)}>
                                        Create your first task
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {tasks.map((task) => (
                                        <Card
                                            key={task._id}
                                            isPressable
                                            onPress={() => {
                                                setSelectedTask(task);
                                                setIsEditOpen(true);
                                            }}
                                        >
                                            <CardBody className="gap-2">
                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="font-medium">{task.title}</p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Chip size="sm" variant="flat" color={statusChipColor(task.status)}>
                                                            {task.status}
                                                        </Chip>
                                                        <Chip size="sm" variant="flat" color={priorityChipColor(task.priority)}>
                                                            {task.priority}
                                                        </Chip>
                                                    </div>
                                                </div>

                                                {task.description ? (
                                                    <p className="text-sm text-foreground-500">{task.description}</p>
                                                ) : null}
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                placement="center"
                scrollBehavior="inside"
                size="lg"
                classNames={{ wrapper: "items-center", base: "my-0 sm:my-0" }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Create task</ModalHeader>
                            <ModalBody>
                                <AddTaskForm onCancel={onClose} onSuccess={onClose} />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setSelectedTask(null);
                }}
                placement="center"
                scrollBehavior="inside"
                size="lg"
                classNames={{ wrapper: "items-center", base: "my-0 sm:my-0" }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit task</ModalHeader>
                            <ModalBody>
                                {selectedTask ? (
                                    <EditTaskForm
                                        key={selectedTask._id}
                                        task={selectedTask}
                                        onCancel={onClose}
                                        onSuccess={onClose}
                                    />
                                ) : null}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}