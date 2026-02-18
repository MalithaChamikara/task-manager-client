"use client";

import { updateTaskAction, type Task, type UpdateTaskInput } from "@/actions/tasks";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";

type EditTaskFormProps = {
    task: Task;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function EditTaskForm({ task, onSuccess, onCancel }: EditTaskFormProps) {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description ?? "");
        setLocalError(null);
    }, [task._id, task.title, task.description]);

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

                updateMutation.mutate({
                    title: trimmedTitle,
                    description: description.trim() ? description.trim() : undefined,
                });
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

            <Input
                label="Description"
                placeholder="Optional details"
                value={description}
                onValueChange={setDescription}
                isDisabled={updateMutation.isPending}
            />

            <Alert
                color="danger"
                title="Couldnt update task"
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
