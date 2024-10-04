import React, { useEffect, useState } from "react";
import { Task as TaskType, TaskStatus } from "../../types";
import { updateTask } from "../../utils";
import styles from "./UpdateTaskForm.module.css";

interface UpdateTaskFormProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
  onCancel: () => void;
}

const UpdateTaskForm: React.FC<UpdateTaskFormProps> = ({
  task,
  onUpdate,
  onCancel,
}) => {
  const [updatedTask, setUpdatedTask] = useState<
    Omit<TaskType, "_id" | "user" | "createdAt" | "updatedAt">
  >({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status as TaskStatus,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Manually format the due date to YYYY-MM-DD
    const date = new Date(task.dueDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDueDate = `${year}-${month}-${day}`;

    setUpdatedTask((prevState) => ({
      ...prevState,
      dueDate: formattedDueDate,
    }));
  }, [task.dueDate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!updatedTask.title) newErrors.title = "Title is required";
    if (!updatedTask.description)
      newErrors.description = "Description is required";
    if (!updatedTask.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedTask({ ...updatedTask, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const updated = await updateTask(task._id, updatedTask);
        onUpdate(updated);
        setApiError(null); // Clear any previous API errors
      } catch (error) {
        setApiError((error as Error).message);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Update Task</h3>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={updatedTask.title}
          onChange={handleChange}
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={updatedTask.description}
          onChange={handleChange}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={updatedTask.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && (
          <span className={styles.error}>{errors.dueDate}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={updatedTask.status}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      <button type="submit">Update Task</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateTaskForm;
