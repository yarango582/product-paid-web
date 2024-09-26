import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import styles from '../styles/ProductDetails.module.css';
import { formatCurrency } from '../utils/currency.util';
import { setSelectedProduct } from '../store/productSlice';
import { useDispatch } from 'react-redux';
import { useAlert } from "../hooks/useAlert";
import Alert from "./Alert";
import { TAXES } from '../constants/taxes.constant';

interface ProductDetailsProps {
  products: Product[];
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = products.find(p => p.id === id);
  const tax = product!.price * TAXES.COL;

  const { showAlert, alert, hideAlert } = useAlert();


  if (!product) {
    return <div className={styles.error}>Producto no encontrado</div>;
  }

  const handleBuyClick = () => {
    if (product.stockQuantity <= 0) {
      showAlert("Producto agotado", "error", 5000);
      return;
    };
    dispatch(setSelectedProduct(product));
    navigate(`/checkout/${product.id}`);
  };

  return (
    <div className={styles.productDetails}>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      )}
      <img src={product.publicImageURL} alt={product.name} className={styles.productImage} />
      <h2 className={styles.productName}>{product.name}</h2>
      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.productPrice}>Precio: {formatCurrency(product.price)}</p>
      <p className={styles.productPrice}>Precio con impuestos: {formatCurrency(product.price+tax)}</p>
      <p className={styles.productStock}>Stock: {product.stockQuantity}</p>
      <button onClick={handleBuyClick} className={styles.buyButton}>
        Comprar con tarjeta de crédito
      </button>
    </div>
  );
};

export default ProductDetails;