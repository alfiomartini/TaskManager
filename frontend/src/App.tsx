import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import CreateTask from "./components/CreateTask/CreateTask";
import ListTasks from "./components/ListTasks/ListTasks";
import GetTask from "./components/GetTask/GetTask";
import UpdateTask from "./components/UpdateTask/UpdateTask";
import DeleteTask from "./components/DeleteTask/DeleteTask";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import TaskOptions from "./components/TaskOptions/TaskOptions";
import Navbar from "./components/Navbar/Navbar";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskOptions />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/list" element={<ListTasks />} />
          <Route path="/tasks/get" element={<GetTask />} />
          <Route path="/tasks/update" element={<UpdateTask />} />
          <Route path="/tasks/delete" element={<DeleteTask />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/logout" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
