export interface CreateTaskRequestBody {
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  userId: string;
}

export interface UpdateTaskRequestBody {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: "pending" | "in-progress" | "completed";
}

export interface TaskRequestParams {
  id: string;
}

export interface SignInRequestBody {
  username: string;
  password: string;
}

export interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

export type TaskFilter = {
  status?: "pending" | "in-progress" | "completed";
};

export const isValidStatus = (
  status: unknown
): status is TaskFilter["status"] => {
  return ["pending", "in-progress", "completed"].includes(status as string);
};

export const isValidSortOrder = (
  sortOrder: unknown
): sortOrder is SortOrder => {
  return ["asc", "desc"].includes(sortOrder as string);
};

export type SortOrder = "asc" | "desc";
