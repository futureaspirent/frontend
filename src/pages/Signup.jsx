




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import styles from "../styles/Login.module.css";
import illustration from "../assets/login.png";
import frame from "../assets/Frame.png";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fname: formData.firstName,
            lname: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Signup failed");
        return;
      }

      alert("Account created successfully");
      navigate("/");
    } catch (err) {
      console.log(err)
      alert("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Start inventory management.</p>

          <form onSubmit={handleSubmit}>
            <InputField
            label="First Name"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <InputField
            label="Last Name"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
          />


            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Example@email.com"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              label="Create Password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="At least 8 characters"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button type="submit">Sign up</Button>

            <p className={styles.signupText}>
              Do you have an account? <Link to="/">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <div className={styles.illustrationSection}>
        <img src={frame} alt="Frame" className={styles.frame} />
        <img src={illustration} alt="Illustration" className={styles.illustration} />
      </div>
    </div>
  );
};

export default Signup;
