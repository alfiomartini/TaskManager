import React from "react";
import { Task as TaskType } from "../../types";
import styles from "./Task.module.css";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
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
    </div>
  );
};

export default Task;
