import InputField from "../InputField";
import { Phone, Shield } from "lucide-react";
import { useState } from "react";
import classes from "./LoginSignUp.module.css";

function Signin({ mobile, setMobile, verificationStatus, onVerify, onSubmit, code, setCode }) {
  const [errors, setErrors] = useState({});

  const validateMobile = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be a 10-digit number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault(); 
    if (validateMobile()) {
      onSubmit(e); 
    }
  };

  const handleVerify = (e) => {
    console.log(e);
    e.preventDefault(); 
    onVerify(e); 
  };

  return (
    <>
      {verificationStatus === "pending" && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <InputField
              icon={Phone}
              placeholder="Mobile"
              type="tel"
              value={mobile}
              onChange={setMobile}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <button
            className={`${classes.button} ${classes.buttonGreen}`}
            type="submit"
          >
            Sign In
          </button>
        </form>
      )}

      {verificationStatus === "inProgress" && (
        <form className="space-y-4" onSubmit={handleVerify}>
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
