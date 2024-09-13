import React from 'react';
import styles from '../styles/Alert.module.css';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;