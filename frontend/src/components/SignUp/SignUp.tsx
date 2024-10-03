import React, { useState } from "react";
import { SignUpForm } from "../../types";
import { authSignUp } from "../../utils";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authSignUp(formData);
      alert("Sign up successful: " + response.message);
      setFormData({ username: "", email: "", password: "" });
      navigate("/signin");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
