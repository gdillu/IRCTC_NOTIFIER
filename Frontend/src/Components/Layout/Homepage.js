import { Fragment } from "react";
import ResponsiveAppBar from "./Header";
import { Button } from "@mui/material";
import classes from "./Homepage.module.css";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

const HomePage = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const onLoginClick = () => {
    // Navigate to login page when the login/signup button is clicked
    navigate("/login");
  };

  // const onGetTrainsClick = () => {
  //   // Navigate to getTrains page when the button is clicked (for authenticated users)
  //   setIsLoggedIn(true);
  //   navigate("/getTrains");
  // };

  const isAuthenticated = localStorage.getItem("isLoggedIn");

  return (
    <Fragment>
      <ResponsiveAppBar />
      <div className={classes.centerContainer}>
        <p className={classes.centerText}>
          {!isAuthenticated && "Sign up / Login to continue"}
          {isAuthenticated && "Schedule your booking"}
        </p>

        <div className={classes.buttonContainer}>
          {isAuthenticated ? (
            <></>
            // <Button
            //   className={classes.button} // Apply the button style here
            //   variant="dark"
            //   color="primary"
            //   onClick={onGetTrainsClick}
            // >
            //   Schedule 
            // </Button>
          ) : (
            <Button
              className={classes.button} // Apply the button style here
              variant="dark"
              color="primary"
              onClick={onLoginClick}
            >
              Sign Up / Login
            </Button>

            
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
