export type TaskStatus = "pending" | "in-progress" | "completed";

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
}

export interface SignInForm {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpResponse {
  message: string;
}

export interface SignInResponse {
  token: string;
}
