import InputField from "../InputField";
import { Phone, Shield } from "lucide-react";
import classes from "./LoginSignUp.module.css";
function Signin({ mobile, setMobile,verificationStatus,onVerify,onSubmit,code,setCode }) {
  return (
    <>
    {verificationStatus === "pending" && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <InputField
            icon={Phone}
            placeholder="Mobile"
            type="tel"
            value={mobile}
            onChange={setMobile}
          />

          <button 
            className={`${classes.button} ${classes.buttonGreen}`}
            type="submit"
          >
            Sign In
            
          </button>
        </form>
      )}
          

{verificationStatus === "inProgress" && (
        <form className="space-y-4" onSubmit={onVerify}>
          <InputField
            icon={Shield}
            placeholder="Verification code"
            type="text"
            value={code}
            onChange={setCode}
          />

          <button 
            className={`${classes.button} ${classes.buttonGreen}`}
            type="submit"
          >
            Verify
            
          </button>
        </form>
      )}
    </>
  );
}

export default Signin;
