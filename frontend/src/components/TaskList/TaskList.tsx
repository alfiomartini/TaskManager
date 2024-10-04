import React, { useEffect, useState } from "react";
import { taskList, deleteTask, addTask, updateTask } from "../../utils";
import Task from "../Task/Task";
import { Task as TaskType } from "../../types";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import UpdateTaskForm from "../UpdateTaskForm/UpdateTaskForm";
import styles from "./TaskList.module.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleAddTask = async (
    newTask: Omit<TaskType, "_id" | "user" | "createdAt" | "updatedAt">
  ) => {
    try {
      const createdTask = await addTask(newTask);
      setTasks([...tasks, createdTask]);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleUpdateTask = async (updatedTask: TaskType) => {
    try {
      const updated = await updateTask(updatedTask._id, updatedTask);
      setTasks(
        tasks.map((task) => (task._id === updated._id ? updated : task))
      );
      setEditingTask(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onUpdate={() => setEditingTask(task)}
          />
        ))}
      </div>
      <div className={styles.addTaskForm}>
        {editingTask ? (
          <UpdateTaskForm
            task={editingTask}
            onUpdate={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        ) : (
          <AddTaskForm onAddTask={handleAddTask} />
        )}
      </div>
    </div>
  );
};

export default TaskList;
