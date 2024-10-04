import React from "react";
import { Task as TaskType } from "../../types";
import styles from "./Task.module.css";

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => Promise<void>;
}

const Task: React.FC<TaskProps> = ({ task, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(task._id);
      console.log(`Task with id ${task._id} deleted`);
    } catch (error) {
      console.error("Error deleting task:", (error as Error).message);
      alert("Error deleting task");
    }
  };

  return (
    <div className={styles.taskContainer}>
      <h3 className={styles.taskTitle}>{task.title}</h3>
      <p className={styles.taskDescription}>{task.description}</p>
      <p className={styles.taskMeta}>
        Due Date: {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className={styles.taskMeta}>Status: {task.status}</p>
      <p className={styles.taskMeta}>
        Created At: {new Date(task.createdAt).toLocaleDateString()}
      </p>
      <p className={styles.taskMeta}>
        Updated At: {new Date(task.updatedAt).toLocaleDateString()}
      </p>
      <button className={styles.taskButton} onClick={handleDelete}>
        Delete
      </button>
      <button className={styles.taskButton}>Update</button>
    </div>
  );
};

export default Task;
