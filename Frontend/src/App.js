import "./App.css";
import { useState } from "react";
import LoginSignupPage from "./Components/Authentication/Login-SignUp";
import Logout from "./Components/Authentication/Logout";
import GetTrains from "./Components/CheckTrains/GetTrains";
import Schedule from "./Components/CheckTrains/Schedule";
import HomePage from "./Components/Layout/Homepage";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute"; // Import the new ProtectedRoute component
import { Route, Routes } from "react-router-dom";

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn"));

  return (
    <Routes>
      <Route
        path="/login"
        exact
        element={
          <div className="pageBackground">
            <LoginSignupPage setIsLoggedIn={(loggedIn) => setIsLoggedIn(loggedIn)}/>
          </div>
        }
      />
      <Route
        path="/checkTrains"
        exact
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <div className="pageBackground">
              <GetTrains />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        exact
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <div className="pageBackground">
              <Logout />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        exact
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <div className="pageBackground">
              <Schedule />
            </div>
          </ProtectedRoute>
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
