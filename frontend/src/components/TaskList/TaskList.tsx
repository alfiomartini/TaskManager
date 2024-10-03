import React, { useEffect, useState } from "react";
import { taskList } from "../../utils";
import Task from "../Task/Task";
import { Task as TaskType } from "../../types";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import styles from "./TaskList.module.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskList();
        setTasks(tasks);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchTasks();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
      <div className={styles.addTaskForm}>
        <AddTaskForm />
      </div>
    </div>
  );
};

export default TaskList;
