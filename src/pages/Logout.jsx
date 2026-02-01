import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear everything from localStorage
    localStorage.clear();

    // Optional: clear sessionStorage also
    sessionStorage.clear();

    // Redirect to login page
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
