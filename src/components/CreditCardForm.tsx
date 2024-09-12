import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Product, Transaction, TransactionData } from '../types';
import { detectCreditCardType } from '../utils/creditCardUtils';
import { processTransaction } from '../services/api';
import { clearCurrentTransaction } from '../store/transactionSlice';
import styles from '../styles/CreditCardForm.module.css';

interface CreditCardFormProps {
  products: Product[];
  onTransactionComplete: (transaction: Transaction) => void;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({ products, onTransactionComplete }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className={styles.error}>Producto no encontrado</div>;
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setCardNumber(number);
    setCardType(detectCreditCardType(number));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const transactionData: TransactionData = {
        productId: product.id,
        cardNumber,
        expiryDate,
        cvv
      };
      const transaction = await processTransaction(transactionData);
      dispatch(clearCurrentTransaction());
      onTransactionComplete(transaction);
      navigate('/transactions');
    } catch (err) {
      console.error(err);
      setError('Error al procesar la transacción. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Información de Tarjeta de Crédito</h2>
      <h3 className={styles.productInfo}>Producto: {product.name} - ${product.price}</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="cardNumber">Número de Tarjeta</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
          />
          {cardType && (
            <img
              src={cardType}
              alt="Card type"
              className={styles.cardLogo}
            />
          )}
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="expiryDate">Fecha de Expiración</label>
        <input
          type="text"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="MM/AA"
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cvv">CVV</label>
        <input
          type="text"
          id="cvv"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
    </form>
  );
};

export default CreditCardForm;