"use client";

import {
    updateTaskAction,
    type Task,
    type TaskPriority,
    type TaskStatus,
    type UpdateTaskInput,
} from "@/actions/tasks";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

type EditTaskFormProps = {
    task: Task;
    onSuccess?: () => void;
    onCancel?: () => void;
};

const STATUS_OPTIONS: Array<{ key: TaskStatus; label: string }> = [
    { key: "todo", label: "To do" },
    { key: "in-progress", label: "In progress" },
    { key: "done", label: "Done" },
];

const PRIORITY_OPTIONS: Array<{ key: TaskPriority; label: string }> = [
    { key: "low", label: "Low" },
    { key: "medium", label: "Medium" },
    { key: "high", label: "High" },
];

export function EditTaskForm({ task, onSuccess, onCancel }: EditTaskFormProps) {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description ?? "");
        setStatus(task.status);
        setPriority(task.priority);
        setLocalError(null);
    }, [task._id, task.title, task.description, task.status, task.priority]);

    const selectedStatusKeys = useMemo(() => new Set([status]), [status]);
    const selectedPriorityKeys = useMemo(() => new Set([priority]), [priority]);

    const updateMutation = useMutation({
        mutationFn: async (dto: UpdateTaskInput) => {
            if (!accessToken) throw new Error("Unauthorized");
            const result = await updateTaskAction(accessToken, task._id, dto);
            if (result.error) throw new Error(result.error);
            return result.data;
        },
        onSuccess: async () => {
            setLocalError(null);
            await queryClient.invalidateQueries({ queryKey: ["tasks"] });
            onSuccess?.();
        },
    });

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                setLocalError(null);

                const trimmedTitle = title.trim();
                if (!trimmedTitle) {
                    setLocalError("Title is required");
                    return;
                }

                const dto: UpdateTaskInput = {
                    title: trimmedTitle,
                    description: description.trim() ? description.trim() : undefined,
                    status,
                    priority,
                };

                updateMutation.mutate(dto);
            }}
        >
            <Input
                label="Title"
                placeholder="e.g. Ship v1"
                value={title}
                onValueChange={setTitle}
                isRequired
                isDisabled={updateMutation.isPending}
            />

            <Textarea
                label="Description"
                placeholder="Optional details"
                value={description}
                onValueChange={setDescription}
                isDisabled={updateMutation.isPending}
                minRows={3}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                    label="Status"
                    selectedKeys={selectedStatusKeys}
                    onSelectionChange={(keys) => {
                        const arr = Array.from(keys as Set<unknown>);
                        setStatus((arr[0] as TaskStatus) ?? task.status);
                    }}
                    isDisabled={updateMutation.isPending}
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>

                <Select
                    label="Priority"
                    selectedKeys={selectedPriorityKeys}
                    onSelectionChange={(keys) => {
                        const arr = Array.from(keys as Set<unknown>);
                        setPriority((arr[0] as TaskPriority) ?? task.priority);
                    }}
                    isDisabled={updateMutation.isPending}
                >
                    {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
            </div>

            <Alert
                color="danger"
                title="Couldn’t update task"
                description={
                    localError ??
                    (updateMutation.error instanceof Error
                        ? updateMutation.error.message
                        : undefined)
                }
                isVisible={Boolean(localError) || Boolean(updateMutation.error)}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {onCancel ? (
                    <Button
                        type="button"
                        variant="flat"
                        onPress={onCancel}
                        isDisabled={updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                ) : null}

                <Button
                    color="primary"
                    type="submit"
                    isLoading={updateMutation.isPending}
                    isDisabled={!accessToken}
                >
                    Save changes
                </Button>
            </div>
        </form>
    );
}