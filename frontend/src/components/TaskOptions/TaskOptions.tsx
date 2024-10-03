import React, { useState } from "react";
import TaskList from "../TaskList/TaskList";
import styles from "./TaskOptions.module.css";

const TaskOptions: React.FC = () => {
  const [view, setView] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setView(view);
  };

  return (
    <div>
      <div className={styles.taskOptions}>
        <div className={styles.buttonContainer}>
          <button onClick={() => handleViewChange("create")}>
            Create Task
          </button>
          <button onClick={() => handleViewChange("list")}>List Tasks</button>
          <button onClick={() => handleViewChange("get")}>Get Task</button>
          <button onClick={() => handleViewChange("update")}>
            Update Task
          </button>
          <button onClick={() => handleViewChange("delete")}>
            Delete Task
          </button>
        </div>
      </div>

      {view === "list" && <TaskList />}
      {/* Add other components conditionally based on the view */}
    </div>
  );
};

export default TaskOptions;
