import React from "react";
import ResponsiveAppBar from "../Layout/Header";
import styles from "./ProtectedRoute.module.css"; // Import the CSS module for styling

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? (
    children
  ) : (
    <div className="pageBackground">
      <ResponsiveAppBar />
      <div className={styles.centerContainer}>
        <h2 className={styles.centerText}>Please log in to access this page.</h2>
        <p className={styles.centerText}>
          You need to be logged in to view this content.{" "}
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
