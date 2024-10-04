import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Navbar from "./components/Navbar/Navbar";
import styles from "./App.module.css";
import TaskList from "./components/TaskList/TaskList";

const App: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/logout" element={<SignIn />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
