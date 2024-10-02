import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";

const Home = () => <h2>Home</h2>;
const CreateTask = () => <h2>Create Task</h2>;
const ListTasks = () => <h2>List Tasks</h2>;
const GetTask = () => <h2>Get Task</h2>;
const UpdateTask = () => <h2>Update Task</h2>;
const DeleteTask = () => <h2>Delete Task</h2>;
const SignIn = () => <h2>Sign In</h2>;
const SignUp = () => <h2>Sign Up</h2>;

const TaskOptions = () => (
  <div className={styles.taskOptions}>
    <Link to="/tasks/create">Create Task</Link>
    <Link to="/tasks/list">List Tasks</Link>
    <Link to="/tasks/get">Get Task</Link>
    <Link to="/tasks/update">Update Task</Link>
    <Link to="/tasks/delete">Delete Task</Link>
  </div>
);

const App: React.FC = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/signin">Sign In</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>

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
  );
};

export default App;
