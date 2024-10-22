import InputField from "./InputField";
import { ArrowRight, Lock, Phone, Shield, User } from "lucide-react";
import classes from "./LoginSignUp.module.css";
function Signin({ mobile, setMobile,verificationStatus,onVerify,onSubmit,code,setCode }) {
  return (
    <>
    {verificationStatus !== "inProgress" && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <InputField
            icon={Phone}
            placeholder="Verification code"
            type="tel"
            value={mobile}
            onChange={setMobile}
          />

          <button 
            className={`${classes.button} ${classes.buttonGreen}`}
            type="submit"
          >
            Verify
            
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
