import { ArrowRight, Phone, Shield, User } from "lucide-react";
import InputField from "../InputField";
import { useState } from "react";
import classes from "./LoginSignUp.module.css";

function SignUp({
  code,
  setCode,
  onVerify,
  name,
  setName,
  mobile,
  setMobile,
  onSubmit,
  verificationStatus,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full Name is required.";
    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be a 10-digit number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e); // Proceed with the submission logic
    }
  };

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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <InputField
              icon={User}
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={setName}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <InputField
              icon={Phone}
              placeholder="Mobile"
              type="tel"
              value={mobile}
              onChange={setMobile}
              required
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

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
