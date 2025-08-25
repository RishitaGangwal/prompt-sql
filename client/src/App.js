import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import QueryForm from "./components/QueryForm";
import PrivateRoute from "./routes/PrivateRoute";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler";

function AppContent() {
  const noNavbarPages = ["/login", "/signup"];
  const location = useLocation();
  const currentPath = location.pathname;
  

  return (
    <div className="flex flex-col min-h-screen">
      {!noNavbarPages.includes(currentPath) && <Navbar />}

      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <QueryForm />
              </PrivateRoute>
            }
          />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
      </div>

      {!noNavbarPages.includes(currentPath) && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
