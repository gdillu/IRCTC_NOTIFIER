import { Lock, Mail } from "lucide-react";
import InputField from "./InputField";

function Signin({ email, setEmail, password, setPassword }) {
  return (
    <>
      <div className="space-y-4">
        <InputField
          icon={Mail}
          placeholder="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />

        <InputField
          icon={Lock}
          placeholder="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
    </>
  );
}

export default Signin;
