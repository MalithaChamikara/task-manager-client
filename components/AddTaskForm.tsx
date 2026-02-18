"use client";

import {
    createTaskAction,
    type CreateTaskInput,
    type TaskPriority,
    type TaskStatus,
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
import { useMemo, useState } from "react";

type AddTaskFormProps = {
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

export function AddTaskForm({ onSuccess, onCancel }: AddTaskFormProps) {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus | "">("");
    const [priority, setPriority] = useState<TaskPriority | "">("");
    const [localError, setLocalError] = useState<string | null>(null);

    const selectedStatusKeys = useMemo(
        () => (status ? new Set([status]) : new Set([])),
        [status],
    );

    const selectedPriorityKeys = useMemo(
        () => (priority ? new Set([priority]) : new Set([])),
        [priority],
    );

    const createMutation = useMutation({
        mutationFn: async (dto: CreateTaskInput) => {
            if (!accessToken) throw new Error("Unauthorized");
            const result = await createTaskAction(accessToken, dto);
            if (result.error) throw new Error(result.error);
            return result.data;
        },
        onSuccess: async () => {
            setTitle("");
            setDescription("");
            setStatus("");
            setPriority("");
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

                const dto: CreateTaskInput = {
                    title: trimmedTitle,
                    description: description.trim() ? description.trim() : undefined,
                    status: status || undefined,
                    priority: priority || undefined,
                };

                createMutation.mutate(dto);
            }}
        >
            <Input
                label="Title"
                placeholder="e.g. Ship v1"
                value={title}
                onValueChange={setTitle}
                isRequired
                isDisabled={createMutation.isPending}
            />

            <Textarea
                label="Description"
                placeholder="Optional details"
                value={description}
                onValueChange={setDescription}
                isDisabled={createMutation.isPending}
                minRows={3}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                    label="Status"
                    placeholder="Default"
                    selectedKeys={selectedStatusKeys}
                    onSelectionChange={(keys) => {
                        const arr = Array.from(keys as Set<unknown>);
                        setStatus((arr[0] as TaskStatus) ?? "");
                    }}
                    isDisabled={createMutation.isPending}
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>

                <Select
                    label="Priority"
                    placeholder="Default"
                    selectedKeys={selectedPriorityKeys}
                    onSelectionChange={(keys) => {
                        const arr = Array.from(keys as Set<unknown>);
                        setPriority((arr[0] as TaskPriority) ?? "");
                    }}
                    isDisabled={createMutation.isPending}
                >
                    {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
            </div>

            <Alert
                color="danger"
                title="Couldn’t create task"
                description={
                    localError ??
                    (createMutation.error instanceof Error
                        ? createMutation.error.message
                        : undefined)
                }
                isVisible={Boolean(localError) || Boolean(createMutation.error)}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {onCancel ? (
                    <Button
                        type="button"
                        variant="flat"
                        onPress={onCancel}
                        isDisabled={createMutation.isPending}
                    >
                        Cancel
                    </Button>
                ) : null}

                <Button
                    color="primary"
                    type="submit"
                    isLoading={createMutation.isPending}
                    isDisabled={!accessToken}
                >
                    Create task
                </Button>
            </div>
        </form>
    );
}