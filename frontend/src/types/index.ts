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
  status: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
