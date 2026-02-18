"use server";

type ApiErrorResponse = {
    statusCode?: number;
    message?: string | string[];
    error?: string;
};

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
    _id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateTaskInput = {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type FindTasksInput = {
    status?: TaskStatus;
    priority?: TaskPriority;
    q?: string;
};

export type ActionResult<T> = {
    data?: T;
    error?: string;
};

function getApiBaseUrl() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    return baseUrl.replace(/\/$/, "");
}

function buildAuthHeaders(accessToken: string) {
    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function parseErrorMessage(res: Response): Promise<string> {
    const text = await res.text().catch(() => "");
    if (!text) return `Request failed (${res.status})`;

    try {
        const json = JSON.parse(text) as ApiErrorResponse;
        const msg = json.message;
        if (Array.isArray(msg)) return msg.join(", ");
        if (typeof msg === "string" && msg.trim()) return msg;
        if (typeof json.error === "string" && json.error.trim()) return json.error;
        return `Request failed (${res.status})`;
    } catch {
        return text;
    }
}

async function apiRequest<T>(
    path: string,
    accessToken: string,
    init: RequestInit,
): Promise<ActionResult<T>> {
    if (!accessToken) return { error: "Unauthorized" };

    const url = `${getApiBaseUrl()}${path}`;

    const res = await fetch(url, {
        ...init,
        headers: {
            ...(init.headers ?? {}),
            ...buildAuthHeaders(accessToken),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return { error: await parseErrorMessage(res) };
    }

    if (res.status === 204) {
        return { data: undefined as T };
    }

    const data = (await res.json().catch(() => undefined)) as T | undefined;
    return { data };
}

export async function createTaskAction(
    accessToken: string,
    dto: CreateTaskInput,
): Promise<ActionResult<Task>> {
    return apiRequest<Task>("/tasks", accessToken, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
    });
}

export async function getTasksAction(
    accessToken: string,
    filters: FindTasksInput = {},
): Promise<ActionResult<Task[]>> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.q) params.set("q", filters.q);

    const query = params.toString();
    const path = query ? `/tasks?${query}` : "/tasks";

    return apiRequest<Task[]>(path, accessToken, {
        method: "GET",
    });
}

export async function getTaskAction(
    accessToken: string,
    id: string,
): Promise<ActionResult<Task>> {
    if (!id) return { error: "Task id is required" };
    return apiRequest<Task>(`/tasks/${encodeURIComponent(id)}`, accessToken, {
        method: "GET",
    });
}

export async function updateTaskAction(
    accessToken: string,
    id: string,
    dto: UpdateTaskInput,
): Promise<ActionResult<Task>> {
    if (!id) return { error: "Task id is required" };

    return apiRequest<Task>(`/tasks/${encodeURIComponent(id)}`, accessToken, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
    });
}

export async function deleteTaskAction(
    accessToken: string,
    id: string,
): Promise<ActionResult<{ deleted: true }>> {
    if (!id) return { error: "Task id is required" };

    return apiRequest<{ deleted: true }>(
        `/tasks/${encodeURIComponent(id)}`,
        accessToken,
        {
            method: "DELETE",
        },
    );
}
