import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import illustration from '../assets/forget.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();




const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email) return alert("Please enter your email");
  
  e.target.setAttribute('disabled',true)
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error generating OTP");

    alert("OTP sent to your email!");
    navigate("/otp", { state: { email } }); 
  } catch (err) {
    console.error(err);
    alert(err.message);
  e.target.setAttribute('disabled',false)

  }
};


  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Please enter your registered email ID to receive an OTP</p>

          <form onSubmit={handleSubmit}>
            <InputField label="E-mail" type="email" placeholder="Enter your registered email " value={email} onChange={(e) => setEmail(e.target.value)} />

            <Button type="submit">Send Mail</Button>
          </form>
        </div>
      </div>

      <div className={styles.illustrationSection}>
        <img src={illustration} alt="Illustration" className={styles.illustration} />
      </div>
    </div>
  );
};

export default ForgotPassword;