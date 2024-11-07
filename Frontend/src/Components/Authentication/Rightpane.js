import classes from "./LoginSignUp.module.css";


export function RightPane({isLogin,toggleMode}) {
    return(
        <div
            className={`${classes.rightPane} w-1/2 ${isLogin ? classes.bgBlue : classes.bgGreen} flex flex-col items-center justify-center`}
          >
            <div className="text-center">
            <h2 className={`${classes.heading} text-lg`}>
                {isLogin ? "New here?" : "Already have an account?"}
              </h2>
              <p className={`${classes.textGray} text-xl`}>
                {isLogin
                  ? "Sign Up for Your Next Journey!"
                  : "Sign in to access your account and continue your journey!"}
              </p>
              <button
                className={`${classes.toggleButton} bg-white px-5 py-2 rounded-lg text-blue-600`}
                onClick={toggleMode}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
    )
}