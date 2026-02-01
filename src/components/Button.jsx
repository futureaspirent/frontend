import styles from '../styles/Button.module.css';

const Button = ({ children, type = 'button', disabled = false }) => {
  return (
    <button type={type} className={styles.btn} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;