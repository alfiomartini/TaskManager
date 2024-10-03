import React, { useState } from "react";
import { addTask } from "../../utils";
import styles from "./AddTaskForm.module.css";

const AddTaskForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Add Task</h3>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <fieldset className={styles.statusFieldset}>
        <legend>Status</legend>
        <div className={styles.status}>
          <label>
            <input
              type="radio"
              name="status"
              value="Pending"
              checked={formData.status === "Pending"}
              onChange={handleStatusChange}
            />
            Pending
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="InProgress"
              checked={formData.status === "InProgress"}
              onChange={handleStatusChange}
            />
            In Progress
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Complete"
              checked={formData.status === "Complete"}
              onChange={handleStatusChange}
            />
            Complete
          </label>
        </div>
      </fieldset>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
