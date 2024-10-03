import { SignUpForm, SignInForm, AuthResponse } from "../types";
import axios from "axios";

export const authSignUp = async (
  formData: SignUpForm
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
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
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
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
