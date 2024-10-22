import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SignUp from "./SignUp";
import Signin from "./Signin";
import classes from './LoginSignUp.module.css'

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const toggleMode = () => setIsLogin(!isLogin);

  return (
     <div className={`${classes.flexContainer} ${classes.flexContainerMd}`}>
      <div className={`${classes.leftPane} ${classes.leftPaneMd }`}>
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
              <button
                  className={`${classes.button} ${isLogin ? classes.buttonBlue : classes.buttonGreen}`}
                >
                  {isLogin ? "Sign In" : "Sign Up"}{" "}
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className={`${classes.rightPane} ${isLogin ? classes.bgBlue : classes.bgGreen} ${classes.rightPaneMd}`}>
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
            className={`${classes.toggleButton} ${isLogin ? classes.toggleColorBlue : classes.toggleColorGreen}`}
            onClick={toggleMode}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
