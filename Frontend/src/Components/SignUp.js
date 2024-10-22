import { ArrowRight, Lock, Phone, Shield, User } from "lucide-react";
import InputField from "./InputField";
import classes from "./LoginSignUp.module.css";

function SignUp({ code, setCode, onVerify, name, setName, mobile, setMobile, onSubmit , verificationStatus}) {
  return (
    <>
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

      {verificationStatus === "pending" && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <InputField
            icon={User}
            placeholder="Full Name"
            type="text"
            value={name}
            onChange={setName}
          />

          

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
            Sign Up
            <ArrowRight className="ml-2" size={20} />
          </button>
        </form>
      )}
    </>
  );
}

export default SignUp;
