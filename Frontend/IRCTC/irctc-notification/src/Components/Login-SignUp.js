import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "./SignUp";
import Signin from "./Signin";
import classes from "./LoginSignUp.module.css";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isVerified, setIsVerified] = useState("pending");
  const [code, setCode] = useState("");
  const [jwtToken, setJwtToken] = useState(null);

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const toggleMode = () => setIsLogin(!isLogin);

  async function submitHandler(event) {
    event.preventDefault();
    const postData = {
      name: name,
      phone: mobile,
    };
    // const response =  await fetch(
    //   'http://localhost:5000/api/userAuth/register',{
    //       method: 'POST',
    //       body: JSON.stringify(postData),
    //       headers:{
    //           'Content-Type':'application/json'
    //       }
    //   }
    // );
    // const resData = await response.json();
    const resData = {
      msg: "Verification code sent",
    };

    if (resData && resData.msg === "Verification code sent") {
      setIsVerified("inProgress");
    }

    console.log(resData);
  }

  async function onVerifyHandler(event) {
    event.preventDefault();
    const postData = {
      code: code,
      phone: mobile,
    };
    // const response =  await fetch(
    //   'http://localhost:5000/api/userAuth/verify',{
    //       method: 'POST',
    //       body: JSON.stringify(postData),
    //       headers:{
    //           'Content-Type':'application/json'
    //       }
    //   }
    // );
    // const resData = await response.json();
    const resData = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3MTYzNmE1MDFmMDRhNGViNDU3ODEwYSJ9LCJpYXQiOjE3Mjk1MDkwNDcsImV4cCI6MTcyOTg2OTA0N30.Reir2OR9-SoONMiZgFDCxBIq11Q3dVC--nLP8sIel4Q",
    };
    setJwtToken(resData.token);
    setIsVerified("Verified");
  }

  return (
    <div className={classes.pageBackground}>
      {isVerified === "Verified" && (
        <div className={classes.centeredHeading}> {/* Apply centering here */}
        <h1 className={classes.heading}>
          Login Successful!
        </h1>
      </div>
      // </div>
      )}
      {isVerified !== "Verified" && (
        <div className={`${classes.flexContainer} ${classes.flexContainerMd}`}>
          <div className={`${classes.leftPane} ${classes.leftPaneMd}`}>
            <div className={classes.formContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={formVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className={classes.heading}>
                    {isLogin ? "Welcome back" : "Create account"}
                  </h1>
                  {!isLogin && (
                    <SignUp
                      name={name}
                      setName={(e) => setName(e.target.value)}
                      password={password}
                      setPassword={(e) => setPassword(e.target.value)}
                      mobile={mobile}
                      setMobile={(e) => setMobile(e.target.value)}
                      onSubmit={submitHandler}
                      verificationStatus={isVerified}
                      onVerify={onVerifyHandler}
                      code={code}
                      setCode={(e) => setCode(e.target.value)}
                    />
                  )}
                  {isLogin && (
                    <Signin
                      email={email}
                      setEmail={(e) => setEmail(e.target.value)}
                      password={password}
                      setPassword={(e) => setPassword(e.target.value)}
                    ></Signin>
                  )}
                  <div className={classes.mt8}>
                    {/* <button
                            className={`${classes.button} ${isLogin ? classes.buttonBlue : classes.buttonGreen}`}
                          >
                            {isLogin ? "Sign In" : "Sign Up"}{" "}
                            <ArrowRight className="ml-2" size={20} />
                          </button> */}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div
            className={`${classes.rightPane} ${
              isLogin ? classes.bgBlue : classes.bgGreen
            } ${classes.rightPaneMd}`}
          >
            <div className="text-center">
              <h2 className={`${classes.heading} ${classes.headingMd}`}>
                {isLogin ? "New here?" : "Already have an account?"}
              </h2>
              <p className={classes.textGray}>
                {isLogin
                  ? "Sign Up for Your Next Journey!"
                  : "Sign in to access your account and continue your journey!"}
              </p>
              <button
                className={`${classes.toggleButton} ${
                  isLogin ? classes.toggleColorBlue : classes.toggleColorGreen
                }`}
                onClick={toggleMode}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignupPage;
