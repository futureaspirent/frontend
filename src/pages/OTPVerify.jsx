import { useState , useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import illustration from '../assets/Startup.png';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location=useLocation();
  // 🔒 Check if email is passed via state
  const email = location.state?.email;
  
  useEffect(() => {
    if (!email) {
      alert("You must enter your email first!");
      // navigate("/forgotpassword");
    }
  }, [email, navigate]);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: location.state.email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error verifying OTP");

    alert("OTP verified! Redirecting to reset password.");
    localStorage.setItem("otpVerified", location.state.email);
    navigate("/resetpassword", { state: { email: location.state.email } });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Enter Your OTP</h1>
          <p className={styles.subtitle}>We’ve sent a 6-digit OTP to your <br/>registered mail.<br/>Please enter it below to sign in.</p>

          <form onSubmit={handleSubmit}>
            <InputField label="OTP" type="text" placeholder="XXXXXX" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} />

            <Button type="submit">Confirm</Button>
          </form>
        </div>
      </div>

      <div className={styles.illustrationSection}>
        <img src={illustration} alt="Illustration" className={styles.illustration} />
      </div>
    </div>
  );
};

export default OTPVerify;