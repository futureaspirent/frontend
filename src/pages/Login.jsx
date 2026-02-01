// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import styles from '../styles/Login.module.css';
// // Replace with your actual exported illustration
// import illustration from '../assets/login.png';
// import frame from '../assets/Frame.png';
// import Singup from './Signup';
// import Forget from './ForgotPassword';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const navigate = useNavigate();


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login submitted:', formData);
//     navigate('/dashboard');
//     // Later: connect to backend
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.formSection}>
//         <div className={styles.formCard}>
//           <h1 className={styles.title}>Log in to your account </h1>
//           <p className={styles.subtitle}>Welcome back! please enter your details.</p>

//           <form onSubmit={handleSubmit}>
//             <InputField
//               label="Email"
//               type="email"
//               placeholder="Example@email.com"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Password"
//               type="password"
//               placeholder="At least 8 characters"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <div className={styles.forgotLink}>
//               <Link to="/forgotpassword">Forgot Password?</Link>
//             </div>

//             <Button type="submit">Sign in</Button>

//             <p className={styles.signupText}>
//               Don't have an account? <Link to="/signup">Sign up</Link>
//             </p>
//           </form>
//         </div>
//       </div>

//       <div className={styles.illustrationSection}>
//         <div className={styles.welcomeOverlay}>
//     <h1 className={styles.welcomeText}>Welcome to  <br />Company Name</h1>
//   {<img src={frame} alt="frame" className={styles.frame} /> }
//   </div>
//         {<img src={illustration} alt="Login illustration" className={styles.illustration} /> }
//         <div style={{ fontSize: '80px' }}></div> {/* Placeholder until you add image */}
//       </div>
//     </div>
//   );
// };

// export default Login;




import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';
import illustration from '../assets/login.png';
import frame from '../assets/Frame.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data)
        setError(data.msg || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Save JWT token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('IASM-UID',data.userId);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Log in to your account</h1>
          <p className={styles.subtitle}>Welcome back! Please enter your details.</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              placeholder="Example@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className={styles.forgotLink}>
              <Link to="/forgotpassword">Forgot Password?</Link>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className={styles.signupText}>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      <div className={styles.illustrationSection}>
        <div className={styles.welcomeOverlay}>
          <h1 className={styles.welcomeText}>
            Welcome to <br />Company Name
          </h1>
          <img src={frame} alt="frame" className={styles.frame} />
        </div>
        <img src={illustration} alt="Login illustration" className={styles.illustration} />
      </div>
    </div>
  );
};

export default Login;
