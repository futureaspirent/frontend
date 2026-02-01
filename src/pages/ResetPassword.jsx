

import { useState , useEffect } from "react";
import {  useNavigate ,useLocation } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import styles from "../styles/Login.module.css";
import illustration from "../assets/createnew.png";


const ResetPassword = () => {
  const location=useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });


  //  Protect page
  useEffect(() => {
    const otpVerified = localStorage.getItem("otpVerified");
    if (!otpVerified) {
      alert("You are not authorized to access this page.");
      navigate("/forgotpassword");
    }
  }, [navigate]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
  const email = location.state?.email;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:email , password: formData.password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Reset failed");
        return;
      }

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create New Password</h1>
          <p className={styles.subtitle}>
Today is a new day. It's your day. You shape it.<br/> 
Sign in to start managing your projects.          </p>

          <form onSubmit={handleSubmit}>
            <InputField
              label=" Enter New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />

            <Button type="submit">Reset Password</Button>
          </form>
        </div>
      </div>

      <div className={styles.illustrationSection}>
        <img src={illustration} alt="Illustration" className={styles.illustration} />
      </div>
    </div>
  );
};

export default ResetPassword;
