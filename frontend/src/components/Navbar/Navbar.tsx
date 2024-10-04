import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/signin");
  };
  return (
    <nav className={styles.nav}>
      <ul>
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
          <Link to="/logout" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
