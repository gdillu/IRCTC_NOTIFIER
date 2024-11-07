import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "./SignUp";
import Signin from "./Signin";
import classes from "./LoginSignUp.module.css";
import ResponsiveAppBar from "../Layout/Header";
import { RightPane } from "./Rightpane";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
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

  async function Login(event) {
    event.preventDefault();
    const postData = {
      phone : "+91"+mobile
    }
    const response = await fetch(
      'http://localhost:5000/api/userAuth/login',{
        method : 'POST',
        body: JSON.stringify(postData),
          headers:{
              'Content-Type':'application/json'
          }
        }
      )
      const resData = await response.json();
      console.log(resData)
    if (resData && resData.msg === "Verification code sent") {
      setIsVerified("inProgress");
    }

    console.log(resData);
  }

  async function Register(event) {
    event.preventDefault();
    const postData = {
      name: name,
      phone: "+91"+mobile,
    };
    const response =  await fetch(
      'http://localhost:5000/api/userAuth/register',{
          method: 'POST',
          body: JSON.stringify(postData),
          headers:{
              'Content-Type':'application/json'
          }
      }
    );
    const resData = await response.json();

    if (resData && resData.msg === "Verification code sent") {
      setIsVerified("inProgress");
    }

    console.log(resData);
  }

  async function onVerifyHandler(event) {
    event.preventDefault();
    const postData = {
      code: code,
      phone: "+91"+mobile,
    };
    const response =  await fetch(
      'http://localhost:5000/api/userAuth/verify',{
          method: 'POST',
          body: JSON.stringify(postData),
          headers:{
              'Content-Type':'application/json'
          }
      }
    );
    const resData = await response.json();
    setJwtToken(resData.token);
    setIsVerified("Verified");
  }

  return (
    <>
    <ResponsiveAppBar/>
      {isVerified === "Verified" && (
        <div className={classes.centeredHeading}> {/* Apply centering here */}
        <h1 className={`${classes.heading} text-3xl font-bold text-gray-100`}>
          Login Successful!
        </h1>
      </div>
      // </div>
      )}
      {isVerified !== "Verified" && (
        <div className={`${classes.flexContainer} w-full h-full`}>
          <div className={`${classes.leftPane} w-1/2 flex items-center justify-center`}>
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
                      mobile = {mobile}
                      setMobile={(e) => setMobile(e.target.value)}
                      onSubmit = {Login}
                      verificationStatus = {isVerified}
                      onVerify = {onVerifyHandler}
                      code = {code}
                      setCode = {(e) => setCode(e.target.value)}
                    ></Signin>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <RightPane isLogin={isLogin} toggleMode={toggleMode}/>
        </div>
      )}
    </>
  );
};

export default LoginSignupPage;