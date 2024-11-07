import "./App.css";
import LoginSignupPage from "./Components/Authentication/Login-SignUp";
import GetTrains from "./Components/CheckTrains/GetTrains";
import Schedule from "./Components/CheckTrains/Schedule";
import HomePage from "./Components/Layout/Homepage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        exact
        element={
          <div className="pageBackground">
            <LoginSignupPage />
          </div>
        }
      />
      <Route
        path="/checkTrains"
        exact
        element={
          <div className="pageBackground">
            <GetTrains/>
          </div>
        }
      />
       <Route
        path="/schedule"
        exact
        element={
          <div className="pageBackground">
            <Schedule/>
          </div>
        }
      />
      <Route
        path="/"
        exact
        element={
          <div className="pageBackground">
            <HomePage />
          </div>
        }
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
