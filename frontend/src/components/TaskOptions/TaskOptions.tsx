import React from "react";
import { Link } from "react-router-dom";
import styles from "./TaskOptions.module.css";

const TaskOptions: React.FC = () => (
  <div className={styles.taskOptions}>
    <Link to="/tasks/create">Create Task</Link>
    <Link to="/tasks/list">List Tasks</Link>
    <Link to="/tasks/get">Get Task</Link>
    <Link to="/tasks/update">Update Task</Link>
    <Link to="/tasks/delete">Delete Task</Link>
  </div>
);

export default TaskOptions;
