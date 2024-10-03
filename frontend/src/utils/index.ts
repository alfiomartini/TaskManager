import {
  SignUpForm,
  SignInForm,
  Task,
  SignInResponse,
  SignUpResponse,
} from "../types";
import axios from "axios";

export const authSignUp = async (
  formData: SignUpForm
): Promise<SignUpResponse> => {
  try {
    const response = await axios.post<SignUpResponse>(
      "http://localhost:3000/api/auth/signup",
      formData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const authSignIn = async (
  formData: SignInForm
): Promise<SignInResponse> => {
  try {
    const response = await axios.post<SignInResponse>(
      "http://localhost:3000/api/auth/signin",
      formData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const taskList = async (): Promise<Task[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get<Task[]>(
      "http://localhost:3000/api/tasks/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
