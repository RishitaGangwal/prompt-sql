import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (email) {
      const user = { email, firstName, lastName };
      localStorage.setItem("user", JSON.stringify(user));
    }

    navigate("/dashboard", { replace: true });
  }, [location, navigate]);

  return <div>Logging in...</div>;
}
