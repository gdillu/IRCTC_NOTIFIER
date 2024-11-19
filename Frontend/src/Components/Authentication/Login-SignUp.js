import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "./SignUp";
import Signin from "./Signin";
import classes from "./LoginSignUp.module.css";
import ResponsiveAppBar from "../Layout/Header";
import { RightPane } from "./Rightpane";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/auth-store";
import { Snackbar } from "@mui/material";

const LoginSignupPage = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isVerified, setIsVerified] = useState("pending");
  const [code, setCode] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const toggleMode = () => setIsLogin(!isLogin);

  async function Login(event) {
    event.preventDefault();
    const postData = {
      phone: "+91" + mobile,
    };

    try {
      const response = await fetch(
        "https://irctc-notifier-backend.onrender.com/api/userAuth/login",
        {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();
      console.log(resData);

      if (resData && resData.msg === "Verification code sent") {
        setIsVerified("inProgress");
        setSnackbar({
          message: "Verification code sent! Please check your phone.",
          type: "success",
        });
      } else {
        setSnackbar({
          message: resData.msg || "An error occurred during login.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        message: error.message || "An error occurred during login.",
        type: "error",
      });
    }
  }

  async function Register(event) {
    event.preventDefault();
    const postData = {
      name: name,
      phone: "+91" + mobile,
    };

    try {
      const response = await fetch(
        "https://irctc-notifier-backend.onrender.com/api/userAuth/register",
        {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();
      console.log(resData);

      if (resData && resData.msg === "Verification code sent") {
        setIsVerified("inProgress");
        setSnackbar({
          message: "Verification code sent! Please check your phone.",
          type: "success",
        });
      } else {
        setSnackbar({
          message: resData.msg || "An error occurred during registration.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        message: error.message || "An error occurred during registration.",
        type: "error",
      });
    }
  }

  async function onVerifyHandler(event) {
    event.preventDefault();
    const postData = {
      code: code,
      phone: "+91" + mobile,
    };

    try {
      const response = await fetch(
        "https://irctc-notifier-backend.onrender.com/api/userAuth/verify",
        {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed, please try again.");
      }

      const resData = await response.json();
      setJwtToken(resData.token);
      setIsVerified("Verified");
      dispatch(authActions.login({ mobile, token: resData.token }));
      setIsLoggedIn(true);

      setSnackbar({ message: "Verification successful!", type: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({
        message: error.message || "An error occurred during verification.",
        type: "error",
      });
    }
  }

  return (
    <>
      <ResponsiveAppBar />
      {isVerified === "Verified" && (
        <div className={classes.centeredHeading}>
          <h1 className={`${classes.heading} text-3xl font-bold text-gray-100`}>
            Login Successful!
          </h1>
        </div>
        // </div>
      )}
      {isVerified !== "Verified" && (
        <div className={`${classes.flexContainer} w-full h-full`}>
          <div
            className={`${classes.leftPane} w-1/2 flex items-center justify-center`}
          >
            <div className={`${classes.formContainer} w-full max-w-md p-5`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={formVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className={`${classes.heading} text-2xl`}>
                    {isLogin ? "Welcome back" : "Create account"}
                  </h1>
                  {!isLogin && (
                    <SignUp
                      name={name}
                      setName={(e) => setName(e.target.value)}
                      mobile={mobile}
                      setMobile={(e) => setMobile(e.target.value)}
                      onSubmit={Register}
                      verificationStatus={isVerified}
                      onVerify={onVerifyHandler}
                      code={code}
                      setCode={(e) => setCode(e.target.value)}
                    />
                  )}
                  {isLogin && (
                    <Signin
                      mobile={mobile}
                      setMobile={(e) => setMobile(e.target.value)}
                      onSubmit={Login}
                      verificationStatus={isVerified}
                      onVerify={onVerifyHandler}
                      code={code}
                      setCode={(e) => setCode(e.target.value)}
                    ></Signin>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <RightPane isLogin={isLogin} toggleMode={toggleMode} />
        </div>
      )}
      <Snackbar
        open={!!snackbar.message}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ message: "", type: "" })}
        message={snackbar.message}
        severity={snackbar.type === "success" ? "success" : "error"}
      />
    </>
  );
};

export default LoginSignupPage;
