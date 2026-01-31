// import { useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import styles from '../styles/Settings.module.css';

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     firstName: 'Sarthak',
//     lastName: 'Pal',
//     email: 'Sarthakpal06@gmail.com',
//     password: '',
//     confirmPassword: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       formData.password &&
//       formData.password !== formData.confirmPassword
//     ) {
//       alert('Passwords do not match!');
//       return;
//     }

//     console.log('Profile updated:', formData);
//     alert('Profile saved!');
//   };

//   return (
//     <div className={styles.container}>
//       <Sidebar />

//       <main className={styles.main}>
//         <div className={styles.formCard}>
//           <h2 className={styles.title}>Edit Profile</h2>

//           <form onSubmit={handleSubmit}>
//             <div className={styles.row}>
//               <div className={styles.field}>
//                 <label>First name</label>
//                 <InputField
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="First name"
//                 />
//               </div>

//               <div className={styles.field}>
//                 <label>Last name</label>
//                 <InputField
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Last name"
//                 />
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label>Email</label>
//               <InputField
//                 value={formData.email}
//                 disabled
//                 placeholder="Email"
//               />
//             </div>

//             <div className={styles.row}>
//               <div className={styles.field}>
//                 <label>Password</label>
//                 <InputField
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                 />
//               </div>

//               <div className={styles.field}>
//                 <label>Confirm Password</label>
//                 <InputField
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             <div className={styles.actions}>
//               <Button type="submit">Save</Button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Settings;




import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import InputField from "../components/InputField";
import Button from "../components/Button";
import styles from "../styles/Settings.module.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  /* ============================
     Fetch logged-in user
     ============================ */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings/me`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ============================
     Update profile
     ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password || undefined,
          }),
        }
      );

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("Profile updated successfully");
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
         <div className={styles.page}>
        <h1>Settings</h1><br/>
        </div>
        <br/>
        <div className={styles.formCard}>
          <h2 className={styles.title}><span style={{borderBottom:"3px solid black"}}>Edit Profile</span></h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>First name</label>
                <InputField
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label>Last name</label>
                <InputField
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            {/* </div> */}

            <div className={styles.field}>
              <label>Email</label>
              <InputField value={formData.email} disabled={true} />

            </div>

            {/* <div className={styles.row}> */}
              <div className={styles.field}>
                <label>Password</label>
                <InputField
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label>Confirm Password</label>
                <InputField
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Settings;

