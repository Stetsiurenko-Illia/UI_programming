import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Tasks from "./components/Tasks";
import About from "./components/About";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    navigate("/tasks");
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="h-100 d-flex flex-column">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            <div className="welcome-page d-flex flex-column justify-content-center align-items-center bg-light">
              <h1 className="display-4 text-center mb-3">
                Плануй свої справи легко!
              </h1>
              <p className="lead text-center mb-4">
                Організуй свій день із нашим додатком.
              </p>
              <div className="d-flex gap-2">
                {!isAuthenticated ? (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowLogin(true)}
                  >
                    Старт
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/tasks")}
                  >
                    Планувати
                  </button>
                )}
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate("/about")}
                >
                  Про додаток
                </button>
              </div>
              {showLogin && (
                <LoginModal
                  onClose={() => setShowLogin(false)}
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={handleSwitchToRegister}
                />
              )}
              {showRegister && (
                <RegisterModal
                  onClose={() => setShowRegister(false)}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              )}
            </div>
          }
        />
        <Route
          path="/tasks"
          element={
            <div className="site-container">
              {isAuthenticated ? <Tasks /> : <Navigate to="/" />}
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="site-container">
              <About />
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div className="site-container">
              {isAuthenticated ? <Profile /> : <Navigate to="/" />}
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
