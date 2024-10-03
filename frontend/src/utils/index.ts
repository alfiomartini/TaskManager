import { SignUpForm, SignInForm } from "../types";

export const authSignUp = (formData: SignUpForm) => {
  console.log("Sign Up Data:", formData);
};

export const authSignIn = (formData: SignInForm) => {
  console.log("Sign In Data:", formData);
};
