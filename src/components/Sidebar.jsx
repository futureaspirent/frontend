


import { NavLink, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

import styles from '../styles/Sidebar.module.css';
import frame from '../assets/Frame.png';

import home from "../assets/home.png";
import product from "../assets/product.png";
import invoice from "../assets/invoice.png";
import statistics from "../assets/statistics.png";
import setting from "../assets/Setting.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  let firstName=localStorage?.getItem("IASM-UID-FN");

  const menuRef = useRef(null);

 

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/logout'); 
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <NavLink to="/dashboard">
          <img src={frame} alt="frame" className={styles.frame1} />
        </NavLink>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/dashboard" end>
          <img src={home} alt="home" className={`${styles.home} ${styles.icon}`} />
          <span className="icon-text"> Home</span>
        </NavLink>

        <NavLink to="/products" end>
          <img src={product} alt="product" className={`${styles.product} ${styles.icon}`} />
          <span className="icon-text"> Product</span>
        </NavLink>

        <NavLink to="/invoices" end>
          <img src={invoice} alt="invoice" className={`${styles.invoice} ${styles.icon}`} />
          <span className="icon-text"> Invoice</span>
        </NavLink>

        <NavLink to="/statistics" end>
          <img src={statistics} alt="statistics" className={`${styles.statistics} ${styles.icon}`} />
          <span className="icon-text"> Statistics</span>
        </NavLink>
      </nav>

      <div className={`${styles.nav} ${styles.nav2}`}>
        <NavLink to="/settings" end>
          <img src={setting} alt="setting" className={`${styles.setting} ${styles.icon}`} />
          <span className="icon-text"> Setting</span>
        </NavLink>
      </div>

      <div className={styles.userWrapper+" "+styles.user} ref={menuRef}>
        <div
          className={styles.user}
          onClick={() => setOpen(prev => !prev)}
        >
          <FiUser />
          <span>{firstName}</span>
        </div>

        {open && (
          <div className={styles.userDropdown}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
