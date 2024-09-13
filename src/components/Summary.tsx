import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import styles from '../styles/Summary.module.css';
import { formatCurrency } from '../utils/currency.util';

const Summary: React.FC = () => {
  const navigate = useNavigate();
  const { currentTransaction } = useSelector((state: RootState) => state.transaction);
  const { selectedProduct } = useSelector((state: RootState) => state.product);

  if (!currentTransaction || !selectedProduct) {
    navigate('/');
    return null;
  }

  const { externalTransactionId, status, amount } = currentTransaction;
  const { name, price } = selectedProduct;

  const handleBack = () => {
    window.location.reload();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Transaction Summary</h2>
      <div className={styles.summary}>
        <p><strong>Transaction ID:</strong> {externalTransactionId}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Product:</strong> {name}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Total Amount:</strong> {formatCurrency(amount || 0)}</p>
      </div>
      <button onClick={handleBack} className={styles.backButton}>
        Back to Products
      </button>
    </div>
  );
};

export default Summary;