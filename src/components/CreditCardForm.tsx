import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCardToken, processTransaction } from "../services/api";
import { setCurrentTransaction, setError } from "../store/transactionSlice";
import { RootState } from "../store/store";
import { detectCreditCardType } from "../utils/creditCardUtils";
import styles from "../styles/CreditCardForm.module.css";
import { useAlert } from "../hooks/useAlert";
import Alert from "./Alert";

export const CreditCardForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct } = useSelector((state: RootState) => state.product);
  const { showAlert, alert, hideAlert } = useAlert();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardLogo, setCardLogo] = useState("");

  useEffect(() => {
    const logo = detectCreditCardType(cardNumber);
    setCardLogo(logo);
  }, [cardNumber]);

  useEffect(() => {
    if(!selectedProduct) {
      navigate("/");
    }
  }, [navigate, selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if(selectedProduct === null) {
        return;
      }
      const { stockQuantity } = selectedProduct;
      if(quantity > stockQuantity) {
        showAlert("La cantidad seleccionada excede el stock disponible", "error", 5000);
        setLoading(false);
        return;
      };
      const cardTokenResponse = await createCardToken({
        productId: selectedProduct?.id || "",
        cardNumber: cardNumber.replace(/\s/g, ""),
        cvv,
        expiryDate: `${expMonth}/${expYear}`,
        cardHolder,
      });

      const cardToken = cardTokenResponse.data.id;

      const paymentResponse = await processTransaction({
        paymentDetails: {
          cardNumber,
          cardHolder,
          expirationDate: `${expMonth}/${expYear}`,
          cvv,
        },
        productId: selectedProduct?.id || "",
        quantity,
        cardToken,
        email,
      });

      dispatch(setCurrentTransaction(paymentResponse));
      navigate("/summary");
    } catch (error) {
      console.error(error);
      showAlert("Error procesando el pago, verifica los datos de la tarjeta", "error");
      dispatch(setError("Error processing payment. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      )}
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Datos de la tarjeta de crédito</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Número de tarjeta</label>
            <div className={styles.cardNumberWrapper}>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
              {cardLogo && (
                <img src={cardLogo} alt="Card logo" className={styles.cardLogo} />
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cardHolder">Nombre del titular</label>
            <input
              type="text"
              id="cardHolder"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expMonth">Mes de expiración</label>
              <input
                type="text"
                id="expMonth"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
                maxLength={2}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="expYear">Año de expiración</label>
              <input
                type="text"
                id="expYear"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YY"
                maxLength={2}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cvv">CVC</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Cantidad</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Pagar ahora"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditCardForm;