import { Fragment } from "react";
import ResponsiveAppBar from "./Header";
import { Button } from "@mui/material";
import classes from "./Homepage.module.css";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const HomePage = () => {
  // const history = useHistory();

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const onLoginClick = () => {
    // history.push("/login");
  };

  return (
    <Fragment>
      <ResponsiveAppBar />
      <div className={classes.centerContainer}>
        <p className={classes.centerText}>
          Sign up / Login to continue
        </p>
      </div>
    </Fragment>
  );
};

export default HomePage;
