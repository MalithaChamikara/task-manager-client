"use client";

import { createTaskAction, type CreateTaskInput } from "@/actions/tasks";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Input } from "@heroui/react";
import { useState } from "react";

type AddTaskFormProps = {
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function AddTaskForm({ onSuccess, onCancel }: AddTaskFormProps) {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

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

                createMutation.mutate({
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
                isDisabled={createMutation.isPending}
            />

            <Input
                label="Description"
                placeholder="Optional details"
                value={description}
                onValueChange={setDescription}
                isDisabled={createMutation.isPending}
            />

            <Alert
                color="danger"
                title="Couldnt create task"
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
